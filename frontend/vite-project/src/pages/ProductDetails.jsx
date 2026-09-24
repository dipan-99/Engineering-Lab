import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/products/${id}`);

                setProduct(response.data.product);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Something went wrong while loading the product."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

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

                    <button className="add-to-cart">
                        Add to Cart
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ProductDetails;