import { useState } from "react";
import { useCart } from "../context/CartContext";

function Checkout() {
    const { cartItems } = useCart();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Shipping Details:", formData);
    };

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    return (
        <div className="checkout-page">

            <h1>Checkout</h1>

            <div className="checkout-layout">

                {/* Shipping Details */}
                <div className="checkout-form-container">

                    <h2>Shipping Details</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Full Name</label>

                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>

                            <input
                                type="text"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                placeholder="Enter your address"
                            />
                        </div>

                        <div className="form-group">
                            <label>City</label>

                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Enter your city"
                            />
                        </div>

                        <div className="form-group">
                            <label>State</label>

                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Enter your state"
                            />
                        </div>

                        <div className="form-group">
                            <label>Pincode</label>

                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="Enter your pincode"
                            />
                        </div>

                        <button
                            type="submit"
                            className="place-order-button"
                        >
                            Continue
                        </button>

                    </form>

                </div>

                {/* Order Summary */}
                <div className="checkout-summary">

                    <h2>Order Summary</h2>

                    {cartItems.map((item) => (
                        <div
                            className="checkout-item"
                            key={item.product._id}
                        >
                            <span>
                                {item.product.name} × {item.quantity}
                            </span>

                            <span>
                                ₹
                                {(
                                    item.product.price *
                                    item.quantity
                                ).toFixed(2)}
                            </span>
                        </div>
                    ))}

                    <hr />

                    <div className="checkout-total">
                        <strong>Total</strong>

                        <strong>
                            ₹{subtotal.toFixed(2)}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Checkout;