import { Link } from "react-router-dom";

function ProductCard({ product }) {
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
            </div>
        </div>
    );
}

export default ProductCard;