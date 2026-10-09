import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({
    product,
    isWishlisted,
    onWishlistChange
}) {
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [addingToCart, setAddingToCart] = useState(false);
    const [updatingQuantity, setUpdatingQuantity] = useState(false);
    const [cartMessage, setCartMessage] = useState("");

    const {
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart
    } = useCart();

    const { addToWishlist } = useWishlist();

    // Find this product in the shared cart
    const cartItem = cartItems.find(
        (item) => String(item.product?._id) === String(product._id)
    );

    const quantity = cartItem?.quantity || 0;

    const handleAddToWishlist = async () => {
        try {
            setSaving(true);
            setMessage("");

            await addToWishlist(product._id);
            onWishlistChange(product._id);

            setMessage("♥ Added to Wishlist");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to save product. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);
            setCartMessage("");

            await addToCart(product._id);
            setCartMessage("✓ Added to Cart");
        } catch (error) {
            setCartMessage(
                error.response?.data?.message ||
                "Unable to add product to cart."
            );
        } finally {
            setAddingToCart(false);
        }
    };

    const handleQuantityChange = async (newQuantity) => {
        if (!cartItem || updatingQuantity) return;

        try {
            setUpdatingQuantity(true);
            setCartMessage("");

            if (newQuantity <= 0) {
                await removeFromCart(product._id);
                setCartMessage("Product removed from cart");
            } else {
                await updateQuantity(product._id, newQuantity);
            }
        } catch (error) {
            setCartMessage(
                error.response?.data?.message ||
                "Unable to update cart quantity."
            );
        } finally {
            setUpdatingQuantity(false);
        }
    };

    return (
        <div className="product-card">
            <img
                className="product-image"
                src={product.image}
                alt={product.name}
            />

            <div className="product-info">
                <h2>{product.name}</h2>

                <p className="product-price">
                    ₹{product.price}
                </p>

                <p>Category: {product.category}</p>
                <p>Stock: {product.stock}</p>

                <Link
                    className="view-details"
                    to={`/ products / ${ product._id } `}
                >
                    View Details
                </Link>

                {/* Wishlist */}
                <button
                    className="wishlist-button"
                    onClick={handleAddToWishlist}
                    disabled={saving || isWishlisted}
                >
                    {isWishlisted
                        ? "♥ Already in Wishlist"
                        : saving
                            ? "⏳ Saving..."
                            : "♡ Add to Wishlist"}
                </button>

                {message && !isWishlisted && (
                    <p className="wishlist-message">
                        {message}
                    </p>
                )}

                {/* Cart */}
                {quantity === 0 ? (
                    <button
                        className="cart-button"
                        onClick={handleAddToCart}
                        disabled={addingToCart || product.stock <= 0}
                    >
                        {product.stock <= 0
                            ? "Out of Stock"
                            : addingToCart
                                ? "⏳ Adding..."
                                : "🛒 Add to Cart"}
                    </button>
                ) : (
                    <div className="product-quantity-wrapper">
                        <div className="product-quantity-control">
                            <button
                                type="button"
                                aria-label={`Decrease ${product.name} quantity`}
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={updatingQuantity}
                            >
                                −
                            </button>

                            <span aria-live="polite">
                                {quantity}
                            </span>

                            <button
                                type="button"
                                aria-label={`Increase ${product.name} quantity`}
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={
                                    updatingQuantity ||
                                    quantity >= product.stock
                                }
                            >
                                +
                            </button>
                        </div>

                        {quantity >= product.stock && (
                            <p className="stock-limit-message">
                                No more stock available
                            </p>
                        )}
                    </div>
                )}

                {cartMessage && (
                    <p className="cart-message" role="status">
                        {cartMessage}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ProductCard;
