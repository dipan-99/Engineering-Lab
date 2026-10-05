import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
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
    const [cartMessage, setCartMessage] = useState("");

    const { addToWishlist } = useWishlist();
    const { addToCart } = useCart();

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
                    to={`/products/${product._id}`}
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
                            : "♡ Add to Wishlist"
                    }
                </button>

                {message && !isWishlisted && (
                    <p className="wishlist-message">
                        {message}
                    </p>
                )}

                {/* Cart */}
                <button
                    className="cart-button"
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock === 0}
                >
                    {product.stock === 0
                        ? "Out of Stock"
                        : addingToCart
                            ? "⏳ Adding..."
                            : "🛒 Add to Cart"
                    }
                </button>

                {cartMessage && (
                    <p className="cart-message">
                        {cartMessage}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ProductCard;