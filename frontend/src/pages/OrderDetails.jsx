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

                setError(
                    error.response?.data?.message ||
                    "Failed to load order"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return <p>Loading order...</p>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>

                <Link to="/orders">
                    Back to My Orders
                </Link>
            </div>
        );
    }

    if (!order) {
        return <p>Order not found.</p>;
    }

    return (
        <div>
            <h2>Order Details</h2>

            <p>
                <strong>Order ID:</strong> {order._id}
            </p>

            <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
            </p>

            <p>
                <strong>Status:</strong> {order.status}
            </p>

            <p>
                <strong>Payment:</strong> {order.paymentStatus}
            </p>

            <h3>Items</h3>

            {order.items.map((item, index) => (
                <div key={index}>
                    <p>
                        <strong>{item.name}</strong>
                    </p>

                    <p>
                        Price: ₹{item.price}
                    </p>

                    <p>
                        Quantity: {item.quantity}
                    </p>

                    <p>
                        Subtotal: ₹{item.price * item.quantity}
                    </p>

                    <hr />
                </div>
            ))}

            <h3>
                Total: ₹{order.totalAmount}
            </h3>

            <h3>Shipping Address</h3>

            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
            </p>
            <p>{order.shippingAddress.pincode}</p>

            <br />

            <Link to="/orders">
                ← Back to My Orders
            </Link>
        </div>
    );
};

export default OrderDetails;