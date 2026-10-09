import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const OrderDetails = () => {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/orders/${id}`);

                setOrder(response.data.order);
            } catch (error) {
                console.error("Failed to fetch order:", error);

                setError(error.response?.data?.message || "Failed to load order");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="order-details-page">
                <div className="order-details-container">
                    <div className="orders-state">
                        <div className="loader"></div>
                        <p>Loading order...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-details-page">
                <div className="order-details-container">
                    <div className="orders-state error-state">
                        <h2>Something went wrong</h2>
                        <p>{error}</p>

                        <Link to="/orders" className="primary-btn">
                            Back to My Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-details-page">
                <div className="order-details-container">
                    <div className="orders-state">
                        <h2>Order Not Found</h2>

                        <Link to="/orders" className="primary-btn">
                            Back to My Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-details-page">
            <div className="order-details-container">
                <Link to="/orders" className="order-details-back-link">
                    ← Back to My Orders
                </Link>

                <div className="details-header">
                    <div>
                        <p className="details-label">ORDER DETAILS</p>

                        <h1>#{order._id}</h1>

                        <p>Placed on {new Date(order.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="details-status">
                        <span
                            className={`big-status ${order.status === "PLACED" ? "status-success" : "status-pending"
                                }`}
                        >
                            {order.status}
                        </span>

                        <span
                            className={`big-payment ${order.paymentStatus === "PAID" ? "paid" : "pending"
                                }`}
                        >
                            Payment: {order.paymentStatus}
                        </span>
                    </div>
                </div>

                <div className="details-grid">
                    <div className="details-main">
                        <div className="details-card">
                            <h2>Items Ordered</h2>

                            {order.items.map((item, index) => (
                                <div className="details-item" key={index}>
                                    {item.image && <img src={item.image} alt={item.name} />}

                                    <div className="details-item-info">
                                        <h3>{item.name}</h3>

                                        <p>
                                            ₹{item.price} × {item.quantity}
                                        </p>
                                    </div>

                                    <strong>₹{item.price * item.quantity}</strong>
                                </div>
                            ))}

                            <div className="details-total">
                                <span>Total</span>

                                <strong>₹{order.totalAmount}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="details-sidebar">
                        <div className="details-card">
                            <h2>Shipping Address</h2>

                            <div className="address">
                                <strong>{order.shippingAddress.fullName}</strong>

                                <p>{order.shippingAddress.phone}</p>

                                <p>{order.shippingAddress.addressLine1}</p>

                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state}
                                </p>

                                <p>{order.shippingAddress.pincode}</p>
                            </div>
                        </div>

                        <div className="details-card">
                            <h2>Payment</h2>

                            <div className="payment-row">
                                <span>Payment Status</span>

                                <strong>{order.paymentStatus}</strong>
                            </div>

                            <div className="payment-row">
                                <span>Order Status</span>

                                <strong>{order.status}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
