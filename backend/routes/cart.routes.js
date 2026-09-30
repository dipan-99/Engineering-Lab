import express from "express";

import {
    addToCart,
    getCart,
    updateCartQuantity
} from "../controllers/cart.controller.js";

import isAuthenticated from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:productId", isAuthenticated, addToCart);
router.get("/", isAuthenticated, getCart);
router.patch("/:productId", isAuthenticated, updateCartQuantity);

export default router;