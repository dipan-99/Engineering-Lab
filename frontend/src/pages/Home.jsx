import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Home() {
    const [customer, setCustomer] = useState(null);
    const [products, setProducts] = useState([]);
    const [profileLoading, setProfileLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        const fetchProfile = async () => {
            try {
                const response = await api.get("/customers/me");

                if (!cancelled) {
                    setCustomer(response.data);
                }
            } catch (error) {
                if (!cancelled) {
                    navigate("/login", { replace: true });
                }
            } finally {
                if (!cancelled) {
                    setProfileLoading(false);
                }
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");

                // Supports either an array response or a { products: [...] } response.
                const data = response.data;
                const productList = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.products)
                        ? data.products
                        : [];

                if (!cancelled) {
                    setProducts(productList.slice(0, 8));
                }
            } catch (error) {
                if (!cancelled) {
                    setProductsError(true);
                }
            } finally {
                if (!cancelled) {
                    setProductsLoading(false);
                }
            }
        };

        fetchProfile();
        fetchProducts();

        return () => {
            cancelled = true;
        };
    }, [navigate]);

    if (profileLoading) {
        return (
            <div className="home-loading">
                <div className="home-spinner" />
                <p>Getting your ShopKart ready...</p>
            </div>
        );
    }

    const firstName = customer?.fullName?.trim().split(/\s+/)[0] || "Shopper";

    const formatPrice = (price) =>
        Number(price || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        });

    return (
        <div className="shop-home">
            {/* <Navbar customer={customer} /> */}

            <main className="shop-home-container">
                {/* Hero */}
                <section className="shop-hero">
                    <div className="shop-hero-content">
                        <span className="shop-eyebrow">
                            YOUR EVERYDAY SHOPPING DESTINATION
                        </span>

                        <h1>
                            Good finds.
                            <br />
                            <span>Great prices.</span>
                            <br />
                            Just for you.
                        </h1>

                        <p>
                            Hey {firstName}! Discover products you'll love, find your next
                            favourite, and make every purchase count.
                        </p>

                        <div className="shop-hero-actions">
                            <Link to="/products" className="shop-primary-button">
                                Explore products <span aria-hidden="true">→</span>
                            </Link>

                            <Link to="/orders" className="shop-secondary-button">
                                Track your orders
                            </Link>
                        </div>

                        <div className="shop-hero-trust">
                            <span>✓ Easy browsing</span>
                            <span>✓ Secure checkout</span>
                            <span>✓ Your cart, your choice</span>
                        </div>
                    </div>

                    <div className="shop-hero-art" aria-hidden="true">
                        <div className="hero-orbit hero-orbit-one" />
                        <div className="hero-orbit hero-orbit-two" />

                        <div className="hero-floating-card hero-card-top">
                            <span>✨</span>
                            <div>
                                <strong>Find your next favourite</strong>
                                <small>Something special awaits</small>
                            </div>
                        </div>

                        <div className="hero-shopping-bag">🛍️</div>

                        <div className="hero-floating-card hero-card-bottom">
                            <span className="hero-sparkle">✦</span>
                            <div>
                                <strong>A little something for you</strong>
                                <small>Discover it on ShopKart</small>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits strip */}
                <section className="shop-benefits" aria-label="Shopping benefits">
                    <div className="shop-benefit">
                        <span className="benefit-icon">🛒</span>
                        <div>
                            <strong>Easy shopping</strong>
                            <p>Browse at your pace</p>
                        </div>
                    </div>

                    <div className="shop-benefit">
                        <span className="benefit-icon">🔒</span>
                        <div>
                            <strong>Secure checkout</strong>
                            <p>Protected payment flow</p>
                        </div>
                    </div>

                    <div className="shop-benefit">
                        <span className="benefit-icon">📦</span>
                        <div>
                            <strong>Order tracking</strong>
                            <p>Keep up with your orders</p>
                        </div>
                    </div>
                </section>

                {/* Featured products */}
                <section className="shop-section">
                    <div className="shop-section-heading">
                        <div>
                            <span className="shop-section-kicker">PICKED FOR YOU</span>
                            <h2>Explore our products</h2>
                            <p>Your next great find could be right here.</p>
                        </div>

                        <Link to="/products" className="shop-text-link">
                            View all <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    {productsLoading ? (
                        <div className="shop-product-message">
                            <div className="home-spinner" />
                            <p>Finding products for you...</p>
                        </div>
                    ) : productsError ? (
                        <div className="shop-product-message">
                            <span className="shop-message-icon">⚠️</span>
                            <h3>We couldn't load the products.</h3>
                            <p>You can still browse the store while we sort that out.</p>
                            <Link to="/products" className="shop-primary-button">
                                Browse store
                            </Link>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="shop-product-message">
                            <span className="shop-message-icon">🛍️</span>
                            <h3>Your next favourite is waiting to be added.</h3>
                            <p>There aren't any products to display here just yet.</p>
                            <Link to="/products" className="shop-primary-button">
                                Visit store
                            </Link>
                        </div>
                    ) : (
                        <div className="shop-product-grid">
                            {products.map((product) => (
                                <article
                                    className="shop-product-card"
                                    key={product._id}
                                >
                                    <Link
                                        to={`/ products / ${product._id} `}
                                        className="shop-product-image-link"
                                        aria-label={`View ${product.name} `}
                                    >
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="shop-product-image"
                                                loading="lazy"
                                                onError={(event) => {
                                                    event.currentTarget.style.display = "none";
                                                    event.currentTarget.nextElementSibling.style.display =
                                                        "flex";
                                                }}
                                            />
                                        ) : null}

                                        <div
                                            className="shop-product-image-fallback"
                                            style={{ display: product.image ? "none" : "flex" }}
                                        >
                                            <span>🛍️</span>
                                            <small>ShopKart find</small>
                                        </div>

                                        <span className="shop-product-image-label">
                                            Discover
                                        </span>
                                    </Link>

                                    <div className="shop-product-info">
                                        <span className="shop-product-category">
                                            {product.category || "Everyday essentials"}
                                        </span>

                                        <h3 title={product.name}>{product.name}</h3>

                                        <div className="shop-product-bottom">
                                            <strong className="shop-product-price">
                                                {formatPrice(product.price)}
                                            </strong>

                                            <Link
                                                to={`/ products / ${product._id} `}
                                                className="shop-product-view"
                                                aria-label={`View details for ${product.name}`}
                                            >
                                                →
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {/* Account shortcuts */}
                <section className="shop-account-banner">
                    <div className="shop-account-copy">
                        <span className="shop-section-kicker">YOUR SHOPKART</span>
                        <h2>Your shopping, all in one place.</h2>
                        <p>
                            Revisit saved favourites, check your cart, and keep track of
                            purchases whenever you need to.
                        </p>
                    </div>

                    <div className="shop-account-actions">
                        <Link to="/wishlist" className="shop-account-link">
                            <span>♡</span>
                            <div>
                                <strong>Your wishlist</strong>
                                <small>Things you love</small>
                            </div>
                            <span className="account-link-arrow">→</span>
                        </Link>

                        <Link to="/cart" className="shop-account-link">
                            <span>🛒</span>
                            <div>
                                <strong>Your cart</strong>
                                <small>Ready when you are</small>
                            </div>
                            <span className="account-link-arrow">→</span>
                        </Link>

                        <Link to="/orders" className="shop-account-link">
                            <span>📦</span>
                            <div>
                                <strong>Your orders</strong>
                                <small>View purchase history</small>
                            </div>
                            <span className="account-link-arrow">→</span>
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="shop-home-footer">
                    <Link to="/home" className="shop-footer-brand">
                        <span className="shop-footer-logo">SK</span>
                        <span>ShopKart</span>
                    </Link>

                    <p>Good finds for your everyday life.</p>

                    <Link to="/products" className="shop-footer-link">
                        Start shopping →
                    </Link>
                </footer>
            </main>
        </div>
    );
}

export default Home;
