import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../utils/authStore';

function Sidebar() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const userName = useAuthStore((state) => state.user?.username);

    const user = {
        username: userName || 'User',
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate('/');
    };

    return (
        <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            {/* Logo */}
            <div className="p-6">
                <NavLink to="/dashboard" className="flex items-center space-x-2">
                    <span className="text-2xl">🔍</span>
                    <span className="font-bold text-xl">WebMonitor</span>
                </NavLink>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-1">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`
                    }
                >
                    <span>🏠</span>
                    <span>Home</span>
                </NavLink>

                <NavLink
                    to="/dashboard/websites"
                    className={({ isActive }) =>
                        `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`
                    }
                >
                    <span>🌐</span>
                    <span>Websites</span>
                </NavLink>

                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) =>
                        `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`
                    }
                >
                    <span>⚙️</span>
                    <span>Settings</span>
                </NavLink>
            </nav>

            {/* Account Section at Bottom */}
            <div className="p-4 border-t border-zinc-800 relative">
                <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                        <span className="text-sm uppercase">{user.username[0]}</span>
                    </div>
                    <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{user.username}</div>
                    </div>
                    <span className="text-zinc-500">▼</span>
                </button>

                {/* Account Dropdown Menu */}
                {showAccountMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowAccountMenu(false)}
                        />
                        <div className="absolute bottom-full left-4 right-4 mb-2 bg-zinc-800 rounded-lg border border-zinc-700 shadow-xl z-50">
                            <div className="p-2">
                                <button
                                    onClick={() => {
                                        setShowAccountMenu(false);
                                        navigate('/dashboard/profile');
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 rounded-md transition-colors"
                                >
                                    👤 Profile
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAccountMenu(false);
                                        navigate('/dashboard/account-settings');
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 rounded-md transition-colors"
                                >
                                    ⚙️ Account Settings
                                </button>
                                <div className="h-px bg-zinc-700 my-2" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Sidebar;