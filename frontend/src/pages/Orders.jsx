import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/orders");

                setOrders(response.data.orders || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load orders"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="orders-page">
                <div className="orders-container">
                    <div className="orders-state">
                        <div className="loader"></div>
                        <p>Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-page">
                <div className="orders-container">
                    <div className="orders-state error-state">
                        <h2>Something went wrong</h2>
                        <p>{error}</p>

                        <Link to="/products" className="primary-btn">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <div className="orders-container">
                    <div className="orders-header">
                        <h1>My Orders</h1>
                    </div>

                    <div className="orders-state empty-state">
                        <div className="empty-icon">📦</div>

                        <h2>No orders yet</h2>

                        <p>
                            You haven't placed any orders yet.
                        </p>

                        <Link
                            to="/products"
                            className="primary-btn"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="orders-container">

                <div className="orders-header">
                    <div>
                        <h1>My Orders</h1>
                        <p>
                            View your order history and track your purchases.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="secondary-btn"
                    >
                        Continue Shopping
                    </Link>
                </div>

                <div className="orders-list">

                    {orders.map((order) => (
                        <div
                            className="order-card"
                            key={order._id}
                        >
                            <div className="order-card-header">

                                <div>
                                    <p className="order-label">
                                        ORDER ID
                                    </p>

                                    <h3>
                                        #{order._id}
                                    </h3>

                                    <p className="order-date">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <div className="order-statuses">

                                    <span
                                        className={`status-badge ${order.status === "PLACED"
                                                ? "status-success"
                                                : "status-pending"
                                            }`}
                                    >
                                        {order.status}
                                    </span>

                                    <span
                                        className={`payment-badge ${order.paymentStatus === "PAID"
                                                ? "payment-success"
                                                : "payment-pending"
                                            }`}
                                    >
                                        {order.paymentStatus}
                                    </span>

                                </div>

                            </div>

                            <div className="order-items">

                                {order.items.map((item, index) => (
                                    <div
                                        className="order-item"
                                        key={index}
                                    >
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                            />
                                        )}

                                        <div className="order-item-info">
                                            <h4>{item.name}</h4>

                                            <p>
                                                ₹{item.price} ×{" "}
                                                {item.quantity}
                                            </p>
                                        </div>

                                        <strong>
                                            ₹
                                            {item.price *
                                                item.quantity}
                                        </strong>
                                    </div>
                                ))}

                            </div>

                            <div className="order-card-footer">

                                <div>
                                    <span>Total</span>

                                    <strong>
                                        ₹{order.totalAmount}
                                    </strong>
                                </div>

                                <Link
                                    to={`/orders/${order._id}`}
                                    className="primary-btn"
                                >
                                    View Details →
                                </Link>

                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Orders;