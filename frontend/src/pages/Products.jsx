import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [wishlistIds, setWishlistIds] = useState(new Set());

    // Fetch wishlist once when page opens
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await api.get("/wishlist");

                const ids = new Set(
                    response.data.wishlist.map(
                        (product) => String(product._id)
                    )
                );

                setWishlistIds(ids);
            } catch (err) {
                console.log("Unable to load wishlist:", err);
            }
        };

        fetchWishlist();
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const params = {};

                if (search) {
                    params.search = search;
                }

                if (category) {
                    params.category = category;
                }

                const response = await api.get("/products", {
                    params
                });

                setProducts(response.data.products);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Something went wrong while loading products."
                );
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchProducts();
        }, 400);

        return () => clearTimeout(timer);
    }, [search, category]);

    const handleWishlistChange = (productId) => {
        setWishlistIds((currentIds) => {
            const updatedIds = new Set(currentIds);

            updatedIds.add(String(productId));

            return updatedIds;
        });
    };

    return (
        <div className="products-page">
            <h1>Products</h1>

            <div className="product-filters">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                </select>
            </div>

            {loading && <h2>Loading products...</h2>}

            {error && <h2>{error}</h2>}

            {!loading && !error && products.length === 0 && (
                <h2>No products found.</h2>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="products-grid">
                    {products.map((product) => {
                        const productId = String(product._id);

                        return (
                            <ProductCard
                                key={productId}
                                product={product}
                                isWishlisted={wishlistIds.has(productId)}
                                onWishlistChange={handleWishlistChange}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Products;