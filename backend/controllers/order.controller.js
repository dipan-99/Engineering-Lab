import crypto from "crypto";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import razorpay from "../config/razorpay.js";

export const createPaymentOrder = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!customer.cart || customer.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        const { shippingAddress } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required",
            });
        }

        const requiredFields = [
            "fullName",
            "phone",
            "addressLine1",
            "city",
            "state",
            "pincode",
        ];

        for (const field of requiredFields) {
            if (
                !shippingAddress[field] ||
                !shippingAddress[field].toString().trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`,
                });
            }
        }

        if (!/^[0-9]{10}$/.test(shippingAddress.phone.trim())) {
            return res.status(400).json({
                success: false,
                message: "Phone number must be 10 digits",
            });
        }

        if (!/^[0-9]{6}$/.test(shippingAddress.pincode.trim())) {
            return res.status(400).json({
                success: false,
                message: "Pincode must be exactly 6 digits",
            });
        }

        const orderItems = [];

        let totalAmount = 0;

        for (const cartItem of customer.cart) {
            const product = await Product.findById(cartItem.product);

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "A product in your cart no longer exists",
                });
            }

            if (product.stock < cartItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} does not have enough stock`,
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image,
            });

            totalAmount += product.price * cartItem.quantity;
        }

        const shopKartOrder = await Order.create({
            user: customer._id,

            items: orderItems,

            shippingAddress: {
                fullName: shippingAddress.fullName.trim(),

                phone: shippingAddress.phone.trim(),

                addressLine1: shippingAddress.addressLine1.trim(),

                city: shippingAddress.city.trim(),

                state: shippingAddress.state.trim(),

                pincode: shippingAddress.pincode.trim(),
            },

            totalAmount,

            paymentStatus: "PENDING",

            status: "PENDING_PAYMENT",
        });

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),

            currency: "INR",

            receipt: shopKartOrder._id.toString(),
        });

        shopKartOrder.razorpayOrderId = razorpayOrder.id;

        await shopKartOrder.save();

        return res.status(201).json({
            success: true,

            message: "Payment order created successfully",

            orderId: shopKartOrder._id,

            razorpayOrderId: razorpayOrder.id,

            amount: razorpayOrder.amount,

            currency: razorpayOrder.currency,

            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Create payment order error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create payment order",
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            shopKartOrderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !shopKartOrderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are required",
            });
        }

        const order = await Order.findOne({
            _id: shopKartOrderId,
            user: req.user._id,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid Razorpay order",
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpay_payment_id;

        await order.save();

        const customer = await Customer.findById(req.user._id);

        if (customer) {
            customer.cart = [];
            await customer.save();
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            orderId: order._id,
        });
    } catch (error) {
        console.error("Verify payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to verify payment",
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Get orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Get order error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order",
        });
    }
};
