import express from "express";

import {
    registerCustomer,
    loginCustomer,
    getProfile,
    logoutCustomer,
    changePassword,
    updateCustomerProfile
} from "../controllers/customer.controller.js";

import isAuthenticated from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

router.get("/me", isAuthenticated, getProfile);
router.patch("/profile", isAuthenticated, updateCustomerProfile);

router.post("/logout", isAuthenticated, logoutCustomer);
router.patch("/change-password", isAuthenticated, changePassword);

export default router;