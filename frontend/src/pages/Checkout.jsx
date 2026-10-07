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

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        console.log("Shipping Details:", formData);
    };

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
            newErrors.phone = "Phone number must be 10 digits";
        }

        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = "Address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
            newErrors.pincode = "Pincode must be exactly 6 digits";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

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

                            {errors.fullName && (
                                <p className="form-error">
                                    {errors.fullName}
                                </p>
                            )}
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

                            {errors.phone && (
                                <p className="form-error">
                                    {errors.phone}
                                </p>
                            )}
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

                            {errors.addressLine1 && (
                                <p className="form-error">
                                    {errors.addressLine1}
                                </p>
                            )}
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

                            {errors.city && (
                                <p className="form-error">
                                    {errors.city}
                                </p>
                            )}
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

                            {errors.state && (
                                <p className="form-error">
                                    {errors.state}
                                </p>
                            )}
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

                            {errors.pincode && (
                                <p className="form-error">
                                    {errors.pincode}
                                </p>
                            )}
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