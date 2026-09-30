import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const refreshCart = async () => {
        try {
            setError("");

            const response = await api.get("/cart");

            setCartItems(response.data.cart || []);

        } catch (err) {
            if (err.response?.status === 401) {
                setCartItems([]);
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load cart."
            );
        }
    };

    // Initial cart load
    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);

            await refreshCart();

            setLoading(false);
        };

        loadCart();
    }, []);

    const addToCart = async (productId) => {
        try {
            const response = await api.post(`/cart/${productId}`);

            // Fetch populated cart data
            await refreshCart();

            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await api.delete(
                `/cart/${productId}`
            );

            // The backend returns the updated cart
            // without populated products.
            await refreshCart();

            return response.data;

        } catch (err) {
            throw err;
        }
    };

    const updateQuantity = async (productId, quantity) => {
        const previousItems = [...cartItems];

        // Update UI immediately
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.product._id === productId
                    ? { ...item, quantity }
                    : item
            )
        );

        try {
            await api.patch(`/cart/${productId}`, { quantity });
        } catch (err) {
            // Restore previous quantity if backend rejects the update
            setCartItems(previousItems);

            throw err;
        }
    };

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                error,
                cartCount,
                refreshCart,
                addToCart,
                removeFromCart,
                updateQuantity
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}