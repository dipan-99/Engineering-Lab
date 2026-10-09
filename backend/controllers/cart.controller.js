import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (!customer.cart) {
            customer.cart = [];
        }

        const cartItem = customer.cart.find(
            (item) => item.product.toString() === productId,
        );

        if (cartItem) {
            const newQuantity = cartItem.quantity + 1;

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: "Requested quantity exceeds available stock",
                });
            }

            cartItem.quantity = newQuantity;
        } else {
            if (product.stock < 1) {
                return res.status(400).json({
                    message: "Product is out of stock",
                });
            }

            customer.cart.push({
                product: productId,
                quantity: 1,
            });
        }

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: customer.cart,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: "cart.product",
            select: "name description price category image stock",
        });

        if (!customer) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        return res.status(200).json({
            success: true,
            cart: customer.cart,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        if (
            typeof quantity !== "number" ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                message: "Quantity must be an integer greater than or equal to 1",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Requested quantity exceeds available stock",
            });
        }

        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const cartItem = customer.cart.find(
            (item) => item.product.toString() === productId,
        );

        if (!cartItem) {
            return res.status(404).json({
                message: "Product not found in cart",
            });
        }

        cartItem.quantity = quantity;

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: customer.cart,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const cartItemIndex = customer.cart.findIndex(
            (item) => item.product.toString() === productId,
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart",
            });
        }

        customer.cart.splice(cartItemIndex, 1);

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: customer.cart,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
