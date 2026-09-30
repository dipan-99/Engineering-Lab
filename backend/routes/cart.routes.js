import express from "express";

import {
    addToCart,
    getCart
} from "../controllers/cart.controller.js";

import isAuthenticated from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:productId", isAuthenticated, addToCart);
router.get("/", isAuthenticated, getCart);

export default router;