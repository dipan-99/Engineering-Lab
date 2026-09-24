import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            stock
        } = req.body;

        // Check required fields
        if (!name || !description || !price || !category || !image || stock === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Validate price
        if (price <= 0) {
            return res.status(400).json({
                message: "Price must be greater than 0"
            });
        }

        // Validate stock
        if (stock < 0) {
            return res.status(400).json({
                message: "Stock cannot be negative"
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        return res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        const filter = {};

        // Search by product name
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter);

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id);

        // Product does not exist
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};