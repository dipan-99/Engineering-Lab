import express from "express";

import {
    createPaymentOrder
} from "../controllers/order.controller.js";

import isAuthenticated from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/create-payment-order",
    isAuthenticated,
    createPaymentOrder
);

export default router;