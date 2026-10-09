import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);
    const [cartMessage, setCartMessage] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/products/" + id.trim());

                setProduct(response.data.product);
            } catch (err) {
                console.error("Product fetch failed:", err);

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Something went wrong while loading the product."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            setAdding(true);
            setCartMessage("");

            await addToCart(product._id);

            setCartMessage("Product added to cart successfully!");
        } catch (err) {
            setCartMessage(
                err.response?.data?.message ||
                err.message ||
                "Failed to add product to cart."
            );
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="product-details-page">
                <h2>Loading product...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-details-page">
                <h2>{error}</h2>

                <Link to="/products">
                    Back to Products
                </Link>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-details-page">
                <h2>Product not found.</h2>

                <Link to="/products">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="product-details-page">

            <Link
                className="back-link"
                to="/products"
            >
                ← Back to Products
            </Link>

            <div className="product-details-card">

                <div className="product-details-image-container">
                    <img
                        className="product-details-image"
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                            e.currentTarget.src = "/vite.svg";
                        }}
                    />
                </div>

                <div className="product-details-info">

                    <h1>{product.name}</h1>

                    <p className="product-details-price">
                        ₹{product.price}
                    </p>

                    <p className="product-details-description">
                        {product.description}
                    </p>

                    <p>
                        <strong>Category:</strong>{" "}
                        {product.category}
                    </p>

                    <p>
                        <strong>Stock:</strong>{" "}
                        {product.stock}
                    </p>

                    <div className="product-details-actions">

                        <button
                            className="add-to-cart"
                            onClick={handleAddToCart}
                            disabled={
                                adding || product.stock <= 0
                            }
                        >
                            {product.stock <= 0
                                ? "Out of Stock"
                                : adding
                                    ? "Adding..."
                                    : "Add to Cart"}
                        </button>

                        <Link
                            to="/cart"
                            className="details-cart-link"
                        >
                            View Cart <span>→</span>
                        </Link>

                    </div>

                    {cartMessage && (
                        <p
                            role="status"
                            className="cart-feedback"
                        >
                            {cartMessage}
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
