import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/wishlist");

                setWishlist(response.data.wishlist);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load your wishlist."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            await api.delete(`/wishlist/${productId}`);

            setWishlist((currentWishlist) =>
                currentWishlist.filter(
                    (product) => product._id !== productId
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to remove product from wishlist."
            );
        }
    };

    if (loading) {
        return (
            <div className="wishlist-page">
                <h2>Loading your wishlist...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wishlist-page">
                <h2>{error}</h2>

                <button
                    className="wishlist-button"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <h1>My Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className="wishlist-empty">
                    <div className="wishlist-empty-icon">❤️</div>

                    <h2>Your wishlist is empty</h2>

                    <p>
                        Save products you love and find them here later.
                    </p>

                    <Link
                        to="/products"
                        className="browse-products-button"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <>
                    <p className="wishlist-count">
                        {wishlist.length} product
                        {wishlist.length !== 1 ? "s" : ""} saved
                    </p>

                    <div className="wishlist-grid">
                        {wishlist.map((product) => (
                            <div
                                className="wishlist-card"
                                key={product._id}
                            >
                                <img
                                    className="wishlist-image"
                                    src={product.image}
                                    alt={product.name}
                                />

                                <div className="wishlist-info">
                                    <h2>{product.name}</h2>

                                    <p className="wishlist-price">
                                        ₹{product.price}
                                    </p>

                                    <p>
                                        Category: {product.category}
                                    </p>

                                    <p>
                                        Stock: {product.stock}
                                    </p>

                                    <div className="wishlist-actions">
                                        <Link
                                            className="view-details"
                                            to={`/products/${product._id}`}
                                        >
                                            View Details
                                        </Link>

                                        <button
                                            className="remove-wishlist"
                                            onClick={() =>
                                                handleRemove(product._id)
                                            }
                                        >
                                            Remove ♥
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Wishlist;