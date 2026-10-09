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

            setError(err.response?.data?.message || "Unable to load cart.");
        }
    };

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

            await refreshCart();

            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await api.delete(`/cart/${productId}`);

            await refreshCart();

            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const updateQuantity = async (productId, quantity) => {
        const previousItems = [...cartItems];

        setCartItems((currentItems) =>
            currentItems.map((item) =>
                String(item.product._id) === String(productId)
                    ? { ...item, quantity }
                    : item,
            ),
        );

        try {
            await api.patch(`/cart/${productId}`, { quantity });
        } catch (err) {
            setCartItems(previousItems);
            throw err;
        }
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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
                updateQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
