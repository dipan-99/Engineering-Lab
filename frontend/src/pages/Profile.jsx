import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCustomer } from "../context/CustomerContext";

function Profile() {
    const navigate = useNavigate();

    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { customer, setCustomer } = useCustomer();

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                fullName: customer.fullName ?? "",
                email: customer.email ?? "",
                phone: customer.phone ?? "",
            });

            setError("");
        }

        setLoading(false);
    }, [customer]);

    const initials = customer?.fullName
        ? customer.fullName
            .trim()
            .split(/\s+/)
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "SK";

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setFormData({
            fullName: customer.fullName ?? "",
            email: customer.email ?? "",
            phone: customer.phone ?? "",
        });

        setError("");
        setSuccess("");
        setEditing(true);
    };

    const handleCancel = () => {
        setFormData({
            fullName: customer.fullName ?? "",
            email: customer.email ?? "",
            phone: customer.phone ?? "",
        });

        setEditing(false);
        setError("");
        setSuccess("");
    };

    const handleSave = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const fullName = formData.fullName.trim();
        const email = formData.email.trim().toLowerCase();
        const phone = formData.phone.trim();

        if (!fullName || !email || !phone) {
            setError("Please fill in all fields.");
            return;
        }

        if (fullName.length > 100) {
            setError("Full name cannot exceed 100 characters.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setSaving(true);

        try {
            const response = await api.patch("/customers/profile", {
                fullName,
                email,
                phone,
            });

            const updatedCustomer = response.data.customer ?? response.data;

            setCustomer(updatedCustomer);

            setFormData({
                fullName: updatedCustomer.fullName ?? "",
                email: updatedCustomer.email ?? "",
                phone: updatedCustomer.phone ?? "",
            });

            setEditing(false);
            setSuccess(response.data.message || "Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile:", err);

            setError(
                err.response?.data?.message ||
                "Failed to update your profile. Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                    <p className="mt-4 text-sm font-medium text-slate-500">
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="text-4xl">👤</div>

                    <h2 className="mt-4 text-xl font-bold text-slate-900">
                        Profile unavailable
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Your profile could not be loaded. Please log in again.
                    </p>

                    <button
                        onClick={() => navigate("/login")}
                        className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold text-indigo-600">
                        SHOPKART ACCOUNT
                    </p>

                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-2 text-slate-500">
                        View your account details and manage your shopping activity.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 sm:px-8">
                            <div className="flex flex-col items-center gap-5 sm:flex-row">
                                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white/30 bg-white text-3xl font-black text-indigo-700 shadow-lg">
                                    {initials}
                                </div>

                                <div className="text-center sm:text-left">
                                    <p className="text-sm font-medium text-indigo-100">
                                        Welcome to ShopKart
                                    </p>

                                    <h2 className="mt-1 text-2xl font-bold text-white">
                                        {customer.fullName || "Customer"}
                                    </h2>

                                    <p className="mt-1 text-sm text-indigo-100">
                                        Account Profile
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Personal Information
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {editing
                                            ? "Update your account details below."
                                            : "Your registered account details"}
                                    </p>
                                </div>

                                {!editing && (
                                    <button
                                        onClick={handleEdit}
                                        className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        ✏️ Edit Profile
                                    </button>
                                )}
                            </div>

                            {success && (
                                <div
                                    role="status"
                                    className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700"
                                >
                                    ✓ {success}
                                </div>
                            )}

                            {error && (
                                <div
                                    role="alert"
                                    className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
                                >
                                    {error}
                                </div>
                            )}

                            {editing ? (
                                <form onSubmit={handleSave}>
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="fullName"
                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                            >
                                                Full Name
                                            </label>

                                            <input
                                                id="fullName"
                                                name="fullName"
                                                type="text"
                                                autoComplete="name"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                maxLength={100}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                            >
                                                Email Address
                                            </label>

                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor="phone"
                                                className="mb-2 block text-sm font-semibold text-slate-700"
                                            >
                                                Phone Number
                                            </label>

                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                maxLength={20}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={saving}
                                            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Full Name
                                            </p>

                                            <p className="mt-2 break-words font-semibold text-slate-900">
                                                {customer.fullName || "Not provided"}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Email Address
                                            </p>

                                            <p className="mt-2 break-all font-semibold text-slate-900">
                                                {customer.email || "Not provided"}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Phone Number
                                            </p>

                                            <p className="mt-2 font-semibold text-slate-900">
                                                {customer.phone || "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                                        <p className="text-sm font-semibold text-indigo-900">
                                            Keep your details up to date
                                        </p>

                                        <p className="mt-1 text-sm text-indigo-700">
                                            Your saved changes will be stored in your ShopKart
                                            account.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    <aside className="space-y-5">
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900">My Activity</h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Quick access to your shopping
                            </p>

                            <button
                                onClick={() => navigate("/orders")}
                                className="mt-5 flex w-full items-center justify-between rounded-2xl border border-slate-100 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
                                        📦
                                    </span>

                                    <span>
                                        <span className="block font-semibold text-slate-900">
                                            My Orders
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            Track your purchases
                                        </span>
                                    </span>
                                </span>

                                <span className="text-slate-400">→</span>
                            </button>

                            <button
                                onClick={() => navigate("/wishlist")}
                                className="mt-3 flex w-full items-center justify-between rounded-2xl border border-slate-100 p-4 text-left transition hover:border-pink-200 hover:bg-pink-50"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-xl">
                                        ❤️
                                    </span>

                                    <span>
                                        <span className="block font-semibold text-slate-900">
                                            Wishlist
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            Saved products
                                        </span>
                                    </span>
                                </span>

                                <span className="rounded-full bg-pink-100 px-2.5 py-1 text-xs font-bold text-pink-700">
                                    {wishlistCount}
                                </span>
                            </button>

                            <button
                                onClick={() => navigate("/cart")}
                                className="mt-3 flex w-full items-center justify-between rounded-2xl border border-slate-100 p-4 text-left transition hover:border-green-200 hover:bg-green-50"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                                        🛒
                                    </span>

                                    <span>
                                        <span className="block font-semibold text-slate-900">
                                            Shopping Cart
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            Items ready to checkout
                                        </span>
                                    </span>
                                </span>

                                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                                    {cartCount}
                                </span>
                            </button>
                        </section>

                        <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
                            <p className="text-sm font-semibold text-indigo-300">SHOPKART</p>

                            <h3 className="mt-2 text-xl font-bold">Happy Shopping!</h3>

                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                Discover products you'll love and keep your shopping organized.
                            </p>

                            <button
                                onClick={() => navigate("/products")}
                                className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-indigo-100"
                            >
                                Browse Products →
                            </button>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default Profile;
