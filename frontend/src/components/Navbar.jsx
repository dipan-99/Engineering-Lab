import { useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import api from '../services/api';

function Navbar({ customer }) {
    const navigate = useNavigate();
    const { cartCount } = useCart();

    const handleLogout = async () => {
        try {
            await api.post('/customers/logout');
            navigate('/login');
        } catch (error) {
            navigate('/login');
        }
    };

    const initials = customer?.fullName
        ? customer.fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'SK';

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

                {/* Logo */}
                <button
                    onClick={() => navigate('/home')}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-lg font-black text-white shadow-md shadow-indigo-500/20">
                        SK
                    </div>

                    <div>
                        <span className="text-xl font-black tracking-tight text-slate-900">
                            Shop<span className="text-indigo-600">Kart</span>
                        </span>
                    </div>
                </button>

                {/* Navigation */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Home */}
                    <button
                        onClick={() => navigate('/home')}
                        className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                    >
                        🏠 Home
                    </button>

                    {/* Products */}
                    <button
                        onClick={() => navigate('/products')}
                        className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                    >
                        🛍️ Products
                    </button>

                    {/* Wishlist */}
                    <button
                        onClick={() => navigate('/wishlist')}
                        className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-pink-50 hover:text-pink-600 cursor-pointer"
                    >
                        ❤️ Wishlist
                    </button>

                    {/* Cart */}
                    <button
                        onClick={() => navigate('/cart')}
                        className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-green-50 hover:text-green-600 cursor-pointer"
                    >
                        🛒 Cart ({cartCount})
                    </button>

                    {/* Customer */}
                    {customer?.fullName && (
                        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2 pr-3.5 shadow-sm">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                {initials}
                            </div>

                            <span className="hidden text-sm font-semibold text-slate-800 sm:inline">
                                {customer.fullName}
                            </span>
                        </div>
                    )}

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 active:scale-95 cursor-pointer"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        Logout
                    </button>

                </div>
            </div>
        </header>
    );
}

export default Navbar;