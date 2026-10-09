import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { useWishlist } from "../context/WishlistContext";
import { useCustomer } from "../context/CustomerContext";

function Navbar() {
    const navigate = useNavigate();

    const { wishlistCount } = useWishlist();
    const { cartCount } = useCart();
    const { customer, setCustomer } = useCustomer();

    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await api.post("/customers/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setCustomer(null);
            setProfileOpen(false);
            navigate("/login", { replace: true });
        }
    };

    const initials = customer?.fullName
        ? customer.fullName
            .trim()
            .split(/\s+/)
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "SK";

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

                <button
                    onClick={() => navigate("/home")}
                    className="flex cursor-pointer items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-lg font-black text-white shadow-md shadow-indigo-500/20">
                        SK
                    </div>

                    <span className="text-xl font-black tracking-tight text-slate-900">
                        Shop<span className="text-indigo-600">Kart</span>
                    </span>
                </button>

                <div className="flex items-center gap-2 sm:gap-3">

                    <button
                        onClick={() => navigate("/home")}
                        className="hidden cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-600 sm:inline-flex"
                    >
                        🏠 Home
                    </button>

                    <button
                        onClick={() => navigate("/products")}
                        className="hidden cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-600 sm:inline-flex"
                    >
                        🛍️ Products
                    </button>

                    <button
                        onClick={() => navigate("/wishlist")}
                        className="hidden cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-pink-50 hover:text-pink-600 sm:inline-flex"
                    >
                        ❤️ Wishlist ({wishlistCount})
                    </button>

                    <button
                        onClick={() => navigate("/cart")}
                        className="hidden cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-green-50 hover:text-green-600 sm:inline-flex"
                    >
                        🛒 Cart ({cartCount})
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen((prev) => !prev)}
                            aria-expanded={profileOpen}
                            aria-label="Toggle profile menu"
                            className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50"
                        >

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-sm">
                                {initials}
                            </div>

                            <div className="hidden text-left sm:block">
                                <p className="max-w-28 truncate text-sm font-semibold text-slate-800">
                                    {customer?.fullName || "My Account"}
                                </p>

                                <p className="text-xs text-slate-500">My Profile</p>
                            </div>

                            <svg
                                className={`h-3 w-3 shrink-0 text-slate-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 9-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {profileOpen && (
                            <>
                                <button
                                    className="fixed inset-0 z-40 cursor-default"
                                    aria-label="Close profile menu"
                                    onClick={() => setProfileOpen(false)}
                                />

                                <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                                    <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 font-bold text-white">
                                            {initials}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-slate-900">
                                                {customer?.fullName || "My Account"}
                                            </p>

                                            <p className="truncate text-xs text-slate-500">
                                                {customer?.email || "Manage your account"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate("/profile");
                                        }}
                                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                                    >
                                        <span>👤</span>
                                        My Profile
                                    </button>

                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate("/orders");
                                        }}
                                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                                    >
                                        <span>📦</span>
                                        My Orders
                                    </button>

                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        <span>↪</span>
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
