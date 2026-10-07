import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const Checkout = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        setShippingAddress((prev) => ({
            ...prev,
            [name]: value
        }));
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

        console.log("1. Pay Now clicked");

        if (!validateForm()) {
            console.log("2. Validation failed");
            return;
        }

        console.log("3. Validation passed");

        try {
            setLoading(true);
            setError("");

            const razorpayLoaded = await loadRazorpayScript();

            console.log("4. Razorpay script loaded:", razorpayLoaded);

            if (!razorpayLoaded) {
                setError("Failed to load Razorpay Checkout");
                return;
            }

            const response = await api.post(
                "/orders/create-payment-order",
                {
                    shippingAddress
                }
            );

            console.log("5. Create payment order response:", response.data);

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

                handler: async function (paymentResponse) {
                    console.log(
                        "6. RAZORPAY RESPONSE:",
                        paymentResponse
                    );

                    try {
                        console.log("7. Sending verification...");

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

                        console.log(
                            "8. Verification response:",
                            verifyResponse.data
                        );

                        if (verifyResponse.data.success) {
                            console.log("9. PAYMENT VERIFIED!");

                            await refreshCart();

                            console.log("10. Cart refreshed");

                            navigate(`/order-success/${data.orderId}`);

                            console.log("11. Navigation called");
                        }

                    } catch (error) {
                        console.error(
                            "10. Verification error:",
                            error.response?.data || error
                        );
                    }
                },

                modal: {
                    ondismiss: function () {
                        console.log("Razorpay modal closed");
                    }
                }
            };

            console.log("11. Razorpay options:", options);

            const razorpay = new window.Razorpay(options);

            console.log("12. Razorpay instance created");

            razorpay.on("payment.failed", function (response) {
                console.log("========== RAZORPAY PAYMENT FAILED ==========");
                console.log("Error:", response.error);
            });

            razorpay.open();

            console.log("13. Razorpay opened");

        } catch (error) {
            console.error(
                "Checkout error:",
                error.response?.data || error
            );
        } finally {
            setLoading(false);
        }
    };

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
                        <p className="error-message">
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
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : "Pay Now"}
                    </button>

                </form>

                <div className="order-summary">

                    <h2>Order Summary</h2>

                    <p>
                        Items: {totalItems}
                    </p>

                    <p>
                        Subtotal: ₹{subtotal.toFixed(2)}
                    </p>

                    <h3>
                        Total: ₹{subtotal.toFixed(2)}
                    </h3>

                </div>

            </div>

        </div>
    );
};

export default Checkout;