import crypto from "crypto";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import razorpay from "../config/razorpay.js";

export const createPaymentOrder = async (req, res) => {
    try {
        // ------------------------------------------
        // 1. Find authenticated customer
        // ------------------------------------------

        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        // ------------------------------------------
        // 2. Check cart
        // ------------------------------------------

        if (!customer.cart || customer.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }


        // ------------------------------------------
        // 3. Get shipping address
        // ------------------------------------------

        const { shippingAddress } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            });
        }


        // ------------------------------------------
        // 4. Validate shipping fields
        // ------------------------------------------

        const requiredFields = [
            "fullName",
            "phone",
            "addressLine1",
            "city",
            "state",
            "pincode"
        ];

        for (const field of requiredFields) {

            if (
                !shippingAddress[field] ||
                !shippingAddress[field].toString().trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }


        // ------------------------------------------
        // 5. Validate phone
        // ------------------------------------------

        if (
            !/^[0-9]{10}$/.test(
                shippingAddress.phone.trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Phone number must be 10 digits"
            });
        }


        // ------------------------------------------
        // 6. Validate pincode
        // ------------------------------------------

        if (
            !/^[0-9]{6}$/.test(
                shippingAddress.pincode.trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Pincode must be exactly 6 digits"
            });
        }


        // ------------------------------------------
        // 7. Build order items
        // ------------------------------------------

        const orderItems = [];

        let totalAmount = 0;


        // ------------------------------------------
        // 8. Get latest Product data
        // ------------------------------------------

        for (const cartItem of customer.cart) {

            const product = await Product.findById(
                cartItem.product
            );

            // Product deleted
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message:
                        "A product in your cart no longer exists"
                });
            }


            // ------------------------------------------
            // 9. Final stock verification
            // ------------------------------------------

            if (product.stock < cartItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message:
                        `${product.name} does not have enough stock`
                });
            }


            // ------------------------------------------
            // 10. Create order snapshot
            // ------------------------------------------

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            });


            // ------------------------------------------
            // 11. Calculate total on server
            // ------------------------------------------

            totalAmount +=
                product.price * cartItem.quantity;
        }


        // ------------------------------------------
        // 12. Create ShopKart Order
        // ------------------------------------------

        const shopKartOrder = await Order.create({

            user: customer._id,

            items: orderItems,

            shippingAddress: {
                fullName:
                    shippingAddress.fullName.trim(),

                phone:
                    shippingAddress.phone.trim(),

                addressLine1:
                    shippingAddress.addressLine1.trim(),

                city:
                    shippingAddress.city.trim(),

                state:
                    shippingAddress.state.trim(),

                pincode:
                    shippingAddress.pincode.trim()
            },

            totalAmount,

            paymentStatus: "PENDING",

            status: "PENDING_PAYMENT"
        });


        // ------------------------------------------
        // 13. Create Razorpay Order
        // ------------------------------------------

        const razorpayOrder =
            await razorpay.orders.create({

                // Razorpay expects paise
                amount:
                    Math.round(totalAmount * 100),

                currency: "INR",

                // ShopKart order ID
                receipt:
                    shopKartOrder._id.toString()
            });


        // ------------------------------------------
        // 14. Save Razorpay Order ID
        // ------------------------------------------

        shopKartOrder.razorpayOrderId =
            razorpayOrder.id;

        await shopKartOrder.save();


        // ------------------------------------------
        // 15. Send safe response
        // ------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Payment order created successfully",

            orderId:
                shopKartOrder._id,

            razorpayOrderId:
                razorpayOrder.id,

            amount:
                razorpayOrder.amount,

            currency:
                razorpayOrder.currency,

            // Public key is okay
            key:
                process.env.RAZORPAY_KEY_ID
        });


    } catch (error) {

        console.error(
            "Create payment order error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to create payment order"
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            shopKartOrderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !shopKartOrderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are required"
            });
        }

        // Find the ShopKart order
        const order = await Order.findOne({
            _id: shopKartOrderId,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Make sure the Razorpay order belongs to our ShopKart order
        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid Razorpay order"
            });
        }

        // Create the signature using our Razorpay secret
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                `${order.razorpayOrderId}|${razorpay_payment_id}`
            )
            .digest("hex");

        // Compare generated signature with Razorpay signature
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Payment is verified
        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpay_payment_id;

        await order.save();

        // Clear cart only after successful payment verification
        const customer = await Customer.findById(req.user._id);

        if (customer) {
            customer.cart = [];
            await customer.save();
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            orderId: order._id
        });

    } catch (error) {
        console.error("Verify payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to verify payment"
        });
    }
};