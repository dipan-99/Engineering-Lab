import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cartItems,
        loading,
        error,
        removeFromCart,
        updateQuantity
    } = useCart();

    if (loading) {
        return (
            <div className="cart-page">
                <h2>Loading your cart...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-page">
                <h2>{error}</h2>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-empty">
                    <div className="cart-empty-icon">🛒</div>

                    <h1>Your cart is empty</h1>

                    <p>
                        Looks like you haven't added anything yet.
                    </p>

                    <Link
                        to="/products"
                        className="browse-products-button"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    // Total number of units
    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // Calculate subtotal from current cart state
    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    const handleIncrease = async (item) => {
        if (item.quantity >= item.product.stock) {
            return;
        }

        try {
            await updateQuantity(
                item.product._id,
                item.quantity + 1
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleDecrease = async (item) => {
        if (item.quantity <= 1) {
            return;
        }

        try {
            await updateQuantity(
                item.product._id,
                item.quantity - 1
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await removeFromCart(productId);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="cart-page">
            <h1>My Cart</h1>

            <div className="cart-layout">

                {/* Cart Items */}
                <div className="cart-items">

                    {cartItems.map((item) => (
                        <div
                            className="cart-item"
                            key={item.product._id}
                        >
                            <img
                                className="cart-item-image"
                                src={item.product.image}
                                alt={item.product.name}
                            />

                            <div className="cart-item-info">

                                <h2>
                                    {item.product.name}
                                </h2>

                                <p className="cart-item-price">
                                    ₹{item.product.price}
                                </p>

                                <p>
                                    Stock: {item.product.stock}
                                </p>

                                <div className="quantity-controls">

                                    <button
                                        onClick={() =>
                                            handleDecrease(item)
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        −
                                    </button>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            handleIncrease(item)
                                        }
                                        disabled={
                                            item.quantity >=
                                            item.product.stock
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    className="remove-cart-button"
                                    onClick={() =>
                                        handleRemove(
                                            item.product._id
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                            <div className="cart-item-total">
                                ₹
                                {(
                                    item.product.price *
                                    item.quantity
                                ).toFixed(2)}
                            </div>
                        </div>
                    ))}

                </div>

                {/* Order Summary */}
                <div className="cart-summary">

                    <h2>Order Summary</h2>

                    <div className="cart-summary-row">
                        <span>Items</span>
                        <span>{totalItems}</span>
                    </div>

                    <div className="cart-summary-row cart-subtotal">
                        <span>Subtotal</span>
                        <span>
                            ₹{subtotal.toFixed(2)}
                        </span>
                    </div>

                    <button
                        className="checkout-button"
                        disabled
                    >
                        Proceed to Checkout
                    </button>

                </div>

            </div>
        </div>
    );
}

export default Cart;