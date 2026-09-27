import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ProductCard({ product }) {
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleAddToWishlist = async () => {
        try {
            setSaving(true);
            setMessage("");

            await api.post(`/wishlist/${product._id}`);

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

                <button
                    className="wishlist-button"
                    onClick={handleAddToWishlist}
                    disabled={saving}
                >
                    {saving ? "⏳ Saving..." : "♡ Add to Wishlist"}
                </button>

                {message && (
                    <p className="wishlist-message">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ProductCard;