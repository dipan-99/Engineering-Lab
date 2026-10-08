import { Link, useParams } from "react-router-dom";

const OrderSuccess = () => {
    const { id } = useParams();

    return (
        <div className="success-page">
            <div className="success-card">

                <div className="success-icon">
                    ✓
                </div>

                <h1>
                    Order Placed Successfully!
                </h1>

                <p className="success-message">
                    Thank you for shopping with ShopKart.
                    Your order has been confirmed.
                </p>

                <div className="success-order-id">
                    <span>ORDER ID</span>
                    <strong>{id}</strong>
                </div>

                <div className="success-actions">

                    <Link
                        to="/orders"
                        className="success-primary"
                    >
                        View My Orders
                    </Link>

                    <Link
                        to="/products"
                        className="success-secondary"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>
        </div>
    );
};

export default OrderSuccess;