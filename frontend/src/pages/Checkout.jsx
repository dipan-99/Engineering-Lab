import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const SHIPPING_STORAGE_KEY = "shopkart_checkout_shipping";

const EMPTY_ADDRESS = {
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: ""
};

const Checkout = () => {
    const {
        cartItems,
        loading: cartLoading,
        refreshCart
    } = useCart();

    const navigate = useNavigate();

    // Restore saved shipping details after a refresh
    const [shippingAddress, setShippingAddress] = useState(() => {
        try {
            const savedAddress = sessionStorage.getItem(
                SHIPPING_STORAGE_KEY
            );

            return savedAddress
                ? { ...EMPTY_ADDRESS, ...JSON.parse(savedAddress) }
                : { ...EMPTY_ADDRESS };
        } catch {
            return { ...EMPTY_ADDRESS };
        }
    });

    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    const handleChange = (e) => {
        const { name, value } = e.target;

        setShippingAddress((previousAddress) => {
            const updatedAddress = {
                ...previousAddress,
                [name]: value
            };

            try {
                sessionStorage.setItem(
                    SHIPPING_STORAGE_KEY,
                    JSON.stringify(updatedAddress)
                );
            } catch (storageError) {
                console.error(
                    "Unable to save checkout details:",
                    storageError
                );
            }

            return updatedAddress;
        });
    };

    const validateForm = () => {
        if (!shippingAddress.fullName.trim()) {
            setError("Full name is required");
            return false;
        }

        if (!/^[0-9]{10}$/.test(shippingAddress.phone.trim())) {
            setError("Phone number must be exactly 10 digits");
            return false;
        }

        if (!shippingAddress.addressLine1.trim()) {
            setError("Address is required");
            return false;
        }

        if (!shippingAddress.city.trim()) {
            setError("City is required");
            return false;
        }

        if (!shippingAddress.state.trim()) {
            setError("State is required");
            return false;
        }

        if (!/^[0-9]{6}$/.test(shippingAddress.pincode.trim())) {
            setError("Pincode must be exactly 6 digits");
            return false;
        }

        setError("");
        return true;
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const existingScript = document.querySelector(
                'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
            );

            if (existingScript) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            navigate("/cart", { replace: true });
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setProcessing(true);
            setError("");

            const razorpayLoaded = await loadRazorpayScript();

            if (!razorpayLoaded) {
                setError("Failed to load Razorpay Checkout");
                return;
            }

            const response = await api.post(
                "/orders/create-payment-order",
                { shippingAddress }
            );

            const data = response.data;

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "ShopKart",
                description: "ShopKart Order",
                order_id: data.razorpayOrderId,

                prefill: {
                    name: shippingAddress.fullName,
                    contact: shippingAddress.phone
                },

                handler: async (paymentResponse) => {
                    try {
                        const verifyResponse = await api.post(
                            "/orders/verify-payment",
                            {
                                shopKartOrderId: data.orderId,
                                razorpay_order_id:
                                    paymentResponse.razorpay_order_id,
                                razorpay_payment_id:
                                    paymentResponse.razorpay_payment_id,
                                razorpay_signature:
                                    paymentResponse.razorpay_signature
                            }
                        );

                        if (verifyResponse.data.success) {
                            // Clear saved address only after verified payment
                            sessionStorage.removeItem(
                                SHIPPING_STORAGE_KEY
                            );

                            await refreshCart();

                            navigate(`/ order-success / ${ data.orderId } `);
                        }
                    } catch (verificationError) {
                        console.error(
                            "Payment verification failed:",
                            verificationError.response?.data ||
                            verificationError
                        );

                        setError(
                            verificationError.response?.data?.message ||
                            "Payment verification failed. If money was deducted, please contact support."
                        );
                    } finally {
                        setProcessing(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        setProcessing(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", (paymentFailure) => {
                console.error(
                    "Razorpay payment failed:",
                    paymentFailure.error
                );

                setError(
                    paymentFailure.error?.description ||
                    "Payment failed. Please try again."
                );

                setProcessing(false);
            });

            razorpay.open();
        } catch (checkoutError) {
            console.error(
                "Checkout error:",
                checkoutError.response?.data || checkoutError
            );

            setError(
                checkoutError.response?.data?.message ||
                "Unable to start checkout. Please try again."
            );

            setProcessing(false);
        }
    };

    // Wait for the initial cart request to finish
    if (cartLoading) {
        return (
            <div className="checkout-page">
                <h2>Checking your cart...</h2>
            </div>
        );
    }

    // Checkout requires at least one cart item
    if (cartItems.length === 0) {
        return <Navigate to="/cart" replace />;
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>

            <div className="checkout-container">
                <form
                    className="checkout-form"
                    onSubmit={handleSubmit}
                >
                    <h2>Shipping Details</h2>

                    {error && (
                        <p className="error-message" role="alert">
                            {error}
                        </p>
                    )}

                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={shippingAddress.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label>Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={shippingAddress.phone}
                            onChange={handleChange}
                            placeholder="10-digit phone number"
                        />
                    </div>

                    <div>
                        <label>Address</label>
                        <input
                            type="text"
                            name="addressLine1"
                            value={shippingAddress.addressLine1}
                            onChange={handleChange}
                            placeholder="Enter your address"
                        />
                    </div>

                    <div>
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={shippingAddress.city}
                            onChange={handleChange}
                            placeholder="Enter your city"
                        />
                    </div>

                    <div>
                        <label>State</label>
                        <input
                            type="text"
                            name="state"
                            value={shippingAddress.state}
                            onChange={handleChange}
                            placeholder="Enter your state"
                        />
                    </div>

                    <div>
                        <label>Pincode</label>
                        <input
                            type="text"
                            name="pincode"
                            value={shippingAddress.pincode}
                            onChange={handleChange}
                            placeholder="6-digit pincode"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                    >
                        {processing ? "Processing..." : "Pay Now"}
                    </button>
                </form>

                <div className="order-summary">
                    <h2>Order Summary</h2>

                    <p>Items: {totalItems}</p>
                    <p>Subtotal: ₹{subtotal.toFixed(2)}</p>

                    <h3>Total: ₹{subtotal.toFixed(2)}</h3>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
