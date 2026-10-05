import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlistCount, setWishlistCount] = useState(0);

    const refreshWishlist = async () => {
        try {
            const response = await api.get("/wishlist");

            setWishlistCount(
                response.data.wishlist?.length || 0
            );
        } catch (error) {
            if (error.response?.status === 401) {
                setWishlistCount(0);
            }
        }
    };

    useEffect(() => {
        refreshWishlist();
    }, []);

    const addToWishlist = async (productId) => {
        const response = await api.post(
            `/wishlist/${productId}`
        );

        await refreshWishlist();

        return response.data;
    };

    const removeFromWishlist = async (productId) => {
        const response = await api.delete(
            `/wishlist/${productId}`
        );

        await refreshWishlist();

        return response.data;
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistCount,
                refreshWishlist,
                addToWishlist,
                removeFromWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}