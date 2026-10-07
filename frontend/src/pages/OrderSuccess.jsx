import { Link, useParams } from "react-router-dom";

function OrderSuccess() {
    const { id } = useParams();

    return (
        <div>
            <h1>Order Placed Successfully! 🎉</h1>

            <p>Your order has been placed successfully.</p>

            <p>
                Order ID: <strong>{id}</strong>
            </p>

            <Link to="/orders">
                View My Orders
            </Link>

            <br />

            <Link to="/products">
                Continue Shopping
            </Link>
        </div>
    );
}

export default OrderSuccess;