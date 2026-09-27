import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addToWishlist = async (req, res) => {
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

        // 3. Get authenticated customer
        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // 4. Check for duplicate
        if (customer.wishlist.includes(productId)) {
            return res.status(409).json({
                message: "Product already in wishlist"
            });
        }

        // 5. Add product
        customer.wishlist.push(productId);

        // 6. Save customer
        await customer.save();

        // 7. Return success
        return res.status(200).json({
            success: true,
            message: "Product added to wishlist"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        // Find authenticated customer and populate wishlist products
        const customer = await Customer.findById(req.user._id)
            .populate({
                path: "wishlist",
                select: "name price category image stock"
            });

        if (!customer) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};