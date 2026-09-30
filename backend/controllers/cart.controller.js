import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        // 2. Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // 3. Find authenticated customer
        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // 4. Make sure cart exists
        if (!customer.cart) {
            customer.cart = [];
        }

        // 5. Check whether product is already in cart
        const cartItem = customer.cart.find(
            (item) => item.product.toString() === productId
        );

        // 6. Product already exists
        if (cartItem) {
            const newQuantity = cartItem.quantity + 1;

            // Check stock
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: "Requested quantity exceeds available stock"
                });
            }

            cartItem.quantity = newQuantity;
        }

        // 7. Product doesn't exist in cart
        else {
            if (product.stock < 1) {
                return res.status(400).json({
                    message: "Product is out of stock"
                });
            }

            customer.cart.push({
                product: productId,
                quantity: 1
            });
        }

        // 8. Save customer
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: customer.cart
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};