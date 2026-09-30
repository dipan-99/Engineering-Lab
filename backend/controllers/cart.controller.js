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

export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
            .populate({
                path: "cart.product",
                select: "name description price category image stock"
            });

        if (!customer) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            cart: customer.cart
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        // 1. Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        // 2. Validate quantity
        if (
            typeof quantity !== "number" ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                message: "Quantity must be an integer greater than or equal to 1"
            });
        }

        // 3. Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // 4. Check stock
        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Requested quantity exceeds available stock"
            });
        }

        // 5. Find customer
        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // 6. Find cart item
        const cartItem = customer.cart.find(
            (item) => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        // 7. Update quantity
        cartItem.quantity = quantity;

        // 8. Save
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: customer.cart
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        // 2. Find customer
        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // 3. Find cart item
        const cartItemIndex = customer.cart.findIndex(
            (item) => item.product.toString() === productId
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        // 4. Remove cart item
        customer.cart.splice(cartItemIndex, 1);

        // 5. Save
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: customer.cart
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};