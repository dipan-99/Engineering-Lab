import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product, isWishlisted, onWishlistChange }) {
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");

    const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

    const { addToWishlist, removeFromWishlist } = useWishlist();

    const cartItem = cartItems.find(
        (item) => String(item.product?._id) === String(product._id),
    );

    const quantity = cartItem?.quantity || 0;

    const handleWishlistToggle = async () => {
        try {
            setSaving(true);
            setMessage("");

            if (isWishlisted) {
                await removeFromWishlist(product._id);
                setMessage("♥ Removed from Wishlist");
            } else {
                await addToWishlist(product._id);
                setMessage("♥ Added to Wishlist");
            }

            onWishlistChange(product._id);
        } catch (error) {
            console.error("Wishlist update failed:", error);

            setMessage(
                error.response?.data?.message ||
                "Unable to update wishlist. Please try again.",
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
                error.response?.data?.message || "Unable to add product to cart.",
            );
        } finally {
            setAddingToCart(false);
        }
    };

    const handleQuantityChange = async (newQuantity) => {
        if (!cartItem) return;

        if (newQuantity > product.stock) {
            setCartMessage("No more stock available");
            return;
        }

        try {
            setCartMessage("");

            if (newQuantity <= 0) {
                await removeFromCart(product._id);
                setCartMessage("Product removed from cart");
            } else {
                await updateQuantity(product._id, newQuantity);
            }
        } catch (error) {
            console.error("Quantity update failed:", error);

            setCartMessage(
                error.response?.data?.message || "Unable to update cart quantity.",
            );
        }
    };

    return (
        <div className="product-card">
            <img className="product-image" src={product.image} alt={product.name} />

            <div className="product-info">
                <h2>{product.name}</h2>

                <p className="product-price">₹{product.price}</p>

                <p>Category: {product.category}</p>
                <p>Stock: {product.stock}</p>

                <Link className="view-details" to={`/ products / ${product._id} `}>
                    View Details
                </Link>

                <button
                    className="wishlist-button"
                    onClick={handleWishlistToggle}
                    disabled={saving}
                >
                    {saving
                        ? "⏳ Updating..."
                        : isWishlisted
                            ? "♥ Remove from Wishlist"
                            : "♡ Add to Wishlist"}
                </button>

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
                                disabled={quantity <= 0}
                            >
                                −
                            </button>

                            <span aria-live="polite">{quantity}</span>

                            <button
                                type="button"
                                aria-label={`Increase ${product.name} quantity`}
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={quantity >= product.stock}
                            >
                                +
                            </button>
                        </div>

                        {quantity >= product.stock && (
                            <p className="stock-limit-message">No more stock available</p>
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
