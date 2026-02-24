import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../utils/authStore';

function Dashboard() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const [activePage, setActivePage] = useState('home');
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const userName = useAuthStore((state) => state.user?.username);

    const user = {
        username: userName,
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate('/');
    };

    const handleNavigation = (page) => {
        setActivePage(page);
        setShowAccountMenu(false);
    };

    // KPI Data
    const kpiData = [
        { title: 'Total Websites', value: '24', change: '+12%', icon: '🌐' },
        { title: 'Active Monitors', value: '18', change: '+5%', icon: '📊' },
        { title: 'Avg Response Time', value: '245ms', change: '-23ms', icon: '⚡' },
        { title: 'Uptime', value: '99.9%', change: '+0.2%', icon: '✅' },
        { title: 'Issues Detected', value: '3', change: '-2', icon: '⚠️' },
        { title: 'Total Checks', value: '1.2M', change: '+180k', icon: '🔄' }
    ];

    // Recent activity data
    const recentActivity = [
        { site: 'example.com', status: 'up', time: '2 min ago', response: '124ms' },
        { site: 'api.example.com', status: 'down', time: '15 min ago', response: 'timeout' },
        { site: 'blog.example.com', status: 'up', time: '25 min ago', response: '89ms' },
        { site: 'shop.example.com', status: 'degraded', time: '1 hour ago', response: '2.3s' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'up': return 'text-green-400';
            case 'down': return 'text-red-400';
            case 'degraded': return 'text-yellow-400';
            default: return 'text-zinc-400';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'up': return 'bg-green-500/10';
            case 'down': return 'bg-red-500/10';
            case 'degraded': return 'bg-yellow-500/10';
            default: return 'bg-zinc-800';
        }
    };

    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-100">
            {/* Sidebar */}
            <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
                {/* Logo */}
                <div className="p-6">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🔍</span>
                        <span className="font-bold text-xl">WebMonitor</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1">
                    <button
                        onClick={() => handleNavigation('home')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activePage === 'home'
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                            }`}
                    >
                        <span>🏠</span>
                        <span>Home</span>
                    </button>

                    <button
                        onClick={() => handleNavigation('websites')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activePage === 'websites'
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                            }`}
                    >
                        <span>🌐</span>
                        <span>Websites</span>
                    </button>

                    <button
                        onClick={() => handleNavigation('settings')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activePage === 'settings'
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                            }`}
                    >
                        <span>⚙️</span>
                        <span>Settings</span>
                    </button>
                </nav>

                {/* Account Section at Bottom */}
                <div className="p-4 border-t border-zinc-800 relative">
                    <button
                        onClick={() => setShowAccountMenu(!showAccountMenu)}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                            <span className="text-sm"> {user.username[0]} </span>
                        </div>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-medium">{user.username}</div>
                            {/* <div className="text-xs text-zinc-500 truncate">{user.email}</div> */}
                        </div>
                        <span className="text-zinc-500">▼</span>
                    </button>

                    {/* Account Dropdown Menu */}
                    {showAccountMenu && (
                        <>
                            {/* Backdrop click handler */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowAccountMenu(false)}
                            />

                            {/* Dropdown menu */}
                            <div className="absolute bottom-full left-4 right-4 mb-2 bg-zinc-800 rounded-lg border border-zinc-700 shadow-xl z-50">
                                <div className="p-2">
                                    <button
                                        onClick={() => {
                                            setShowAccountMenu(false);
                                            // Handle profile click
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 rounded-md transition-colors"
                                    >
                                        👤 Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAccountMenu(false);
                                            // Handle account settings
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

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {activePage === 'home' && (
                    <div className="p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                            <p className="text-zinc-400">Monitor your websites in real-time</p>
                        </div>

                        {/* KPI Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {kpiData.map((kpi, index) => (
                                <div key={index} className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-zinc-400 text-sm mb-1">{kpi.title}</p>
                                            <p className="text-3xl font-bold">{kpi.value}</p>
                                        </div>
                                        <span className="text-3xl">{kpi.icon}</span>
                                    </div>
                                    <div className="mt-4">
                                        <span className={`text-sm ${kpi.change.startsWith('+') ? 'text-green-400' :
                                            kpi.change.startsWith('-') ? 'text-red-400' : 'text-zinc-400'
                                            }`}>
                                            {kpi.change} from last month
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity Section */}
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
                            <div className="p-6 border-b border-zinc-800">
                                <h2 className="text-xl font-semibold">Recent Activity</h2>
                            </div>
                            <div className="divide-y divide-zinc-800">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="p-6 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                                            <div>
                                                <p className="font-medium">{activity.site}</p>
                                                <p className="text-sm text-zinc-500">{activity.time}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm ${getStatusBg(activity.status)} ${getStatusColor(activity.status)}`}>
                                            {activity.status === 'up' ? 'Operational' :
                                                activity.status === 'down' ? 'Down' : 'Degraded'}
                                            {activity.response && ` • ${activity.response}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                                <h3 className="font-semibold mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left px-4 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                                        ➕ Add New Website
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                                        🔄 Run Manual Check
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                                        📊 Generate Report
                                    </button>
                                </div>
                            </div>

                            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                                <h3 className="font-semibold mb-4">System Status</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-zinc-400">Monitor Service</span>
                                            <span className="text-green-400">Operational</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-zinc-400">API Gateway</span>
                                            <span className="text-green-400">Operational</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-zinc-400">Database</span>
                                            <span className="text-yellow-400">Degraded</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-2">
                                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activePage === 'websites' && (
                    <div className="p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2">Websites</h1>
                            <p className="text-zinc-400">Manage and monitor your websites</p>
                        </div>

                        {/* Add Website Form */}
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-6">Add New Website</h2>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Website Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">
                                            Website Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Company Website"
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg 
                                     text-zinc-100 placeholder-zinc-500
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                     transition-colors"
                                        />
                                        <p className="text-xs text-zinc-500">A friendly name to identify this site</p>
                                    </div>

                                    {/* Website URL */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">
                                            Website URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://example.com"
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg 
                                     text-zinc-100 placeholder-zinc-500
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                     transition-colors"
                                        />
                                        <p className="text-xs text-zinc-500">Include http:// or https://</p>
                                    </div>

                                    {/* Check Interval */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">
                                            Check Interval
                                        </label>
                                        <select
                                            defaultValue="1" 
                                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg 
                                     text-zinc-100
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                     transition-colors"
                                        >
                                            <option value="1">Every 1 minute</option>
                                            <option value="5">Every 5 minutes</option>
                                            <option value="15">Every 15 minutes</option>
                                            <option value="30">Every 30 minutes</option>
                                            <option value="60">Every hour</option>
                                            <option value="360">Every 6 hours</option>
                                            <option value="720">Every 12 hours</option>
                                            <option value="1440">Once daily</option>
                                        </select>
                                        <p className="text-xs text-zinc-500">How often to check this website</p>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="space-y-2 flex items-end">
                                        <button
                                            type="submit"
                                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 
                                     text-white font-medium rounded-lg
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                     transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <span>➕</span>
                                            <span>Add Website</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Advanced Options (Expandable) */}
                                <div className="pt-4 border-t border-zinc-800">
                                    <details className="group">
                                        <summary className="text-sm text-zinc-400 hover:text-zinc-300 cursor-pointer list-none flex items-center">
                                            <span className="mr-2">🔧</span>
                                            Advanced Options
                                            <span className="ml-2 group-open:rotate-180 transition-transform">▼</span>
                                        </summary>
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Expected Status Code */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-300">
                                                    Expected Status Code
                                                </label>
                                                <input
                                                    type="number"
                                                    defaultValue="200"
                                                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg 
                                             text-zinc-100
                                             focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                />
                                            </div>

                                            {/* Timeout */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-300">
                                                    Timeout (seconds)
                                                </label>
                                                <input
                                                    type="number"
                                                    defaultValue="30"
                                                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg 
                                             text-zinc-100
                                             focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                />
                                            </div>

                                            {/* Check Method */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-300">
                                                    Check Method
                                                </label>
                                                <select
                                                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg 
                                             text-zinc-100
                                             focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                >
                                                    <option value="GET">GET Request</option>
                                                    <option value="HEAD">HEAD Request</option>
                                                    <option value="POST">POST Request</option>
                                                </select>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            </form>
                        </div>

                        {/* Existing Websites List */}
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
                            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Monitored Websites</h2>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        placeholder="Search websites..."
                                        className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg 
                                 text-zinc-100 placeholder-zinc-500 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                    <select
                                        className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg 
                                 text-zinc-100 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="up">Operational</option>
                                        <option value="down">Down</option>
                                        <option value="degraded">Degraded</option>
                                        <option value="paused">Paused</option>
                                    </select>
                                </div>
                            </div>

                            {/* Websites Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-zinc-800/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Website</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">URL</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Interval</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Uptime</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Response</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Last Check</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {/* Sample Website Entries */}
                                        <tr className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="flex items-center">
                                                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                                                    <span className="text-sm text-green-400">Operational</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">Company Website</td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">https://example.com</td>
                                            <td className="px-6 py-4 text-sm">5 minutes</td>
                                            <td className="px-6 py-4 text-sm text-green-400">99.98%</td>
                                            <td className="px-6 py-4 text-sm">124ms</td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">2 min ago</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <button className="text-zinc-400 hover:text-blue-400 transition-colors" title="Edit">
                                                        ✏️
                                                    </button>
                                                    <button className="text-zinc-400 hover:text-yellow-400 transition-colors" title="Pause">
                                                        ⏸️
                                                    </button>
                                                    <button className="text-zinc-400 hover:text-red-400 transition-colors" title="Delete">
                                                        🗑️
                                                    </button>
                                                    <button className="text-zinc-400 hover:text-green-400 transition-colors" title="Check Now">
                                                        🔄
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="flex items-center">
                                                    <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                                                    <span className="text-sm text-red-400">Down</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">API Service</td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">https://api.example.com</td>
                                            <td className="px-6 py-4 text-sm">1 minute</td>
                                            <td className="px-6 py-4 text-sm text-red-400">95.23%</td>
                                            <td className="px-6 py-4 text-sm">Timeout</td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">15 min ago</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <button className="text-zinc-400 hover:text-blue-400 transition-colors" title="Edit">
                                                        ✏️
                                                    </button>
                                                    <button className="text-zinc-400 hover:text-yellow-400 transition-colors" title="Pause">
                                                        ⏸️
                                                    </button>
                                                    <button className="text-zinc-400 hover:text-red-400 transition-colors" title="Delete">
                                                        🗑️
                                                    </button>
                                                    <button className="text-zinc-400 hover:text-green-400 transition-colors" title="Check Now">
                                                        🔄
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="flex items-center">
                                                    <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                                                    <span className="text-sm text-yellow-400">Degraded</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">Blog Platform</td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">https://blog.example.com</td>
                                            <td className="px-6 py-4 text-sm">15 minutes</td>
                                            <td className="px-6 py-4 text-sm text-yellow-400">98.45%</td>
                                            <td className="px-6 py-4 text-sm">2.3s</td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">25 min ago</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <button className="text-zinc-400 hover:text-blue-400 transition-colors" title="Edit">
                                                        ✏️
                                                    </button>
                                                    <button className="text-zinc-400 hover:text-yellow-400 transition-colors" title="Pause">
                                                        ⏸️
                                                    </button>
                                                    <button className="text-zinc-400 hover:text-red-400 transition-colors" title="Delete">
                                                        🗑️
                                                    </button>
                                                    <button className="text-zinc-400 hover:text-green-400 transition-colors" title="Check Now">
                                                        🔄
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="flex items-center">
                                                    <span className="w-2 h-2 rounded-full bg-zinc-500 mr-2"></span>
                                                    <span className="text-sm text-zinc-400">Paused</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">Development Server</td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">https://dev.example.com</td>
                                            <td className="px-6 py-4 text-sm">30 minutes</td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">-</td>
                                            <td className="px-6 py-4 text-sm">-</td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">2 hours ago</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <button className="text-zinc-400 hover:text-blue-400 transition-colors" title="Edit">
                                                        ✏️
                                                    </button>
                                                    <button className="text-zinc-400 hover:text-green-400 transition-colors" title="Resume">
                                                        ▶️
                                                    </button>
                                                    <button className="text-zinc-400 hover:text-red-400 transition-colors" title="Delete">
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-6 border-t border-zinc-800 flex items-center justify-between">
                                <div className="text-sm text-zinc-400">
                                    Showing 1 to 4 of 24 websites
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors disabled:opacity-50" disabled>
                                        Previous
                                    </button>
                                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">1</button>
                                    <button className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-700 transition-colors">2</button>
                                    <button className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-700 transition-colors">3</button>
                                    <button className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-700 transition-colors">4</button>
                                    <span className="text-zinc-500">...</span>
                                    <button className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-700 transition-colors">6</button>
                                    <button className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-700 transition-colors">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bulk Actions Bar */}
                        <div className="mt-6 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <input type="checkbox" className="w-4 h-4 rounded bg-zinc-800 border-zinc-700" />
                                <span className="text-sm text-zinc-400">Select all</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                    Pause Selected
                                </button>
                                <button className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                    Resume Selected
                                </button>
                                <button className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                                    Delete Selected
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activePage === 'settings' && (
                    <div className="p-8">
                        <h1 className="text-3xl font-bold mb-4">Settings</h1>
                        <p className="text-zinc-400">Settings page content would go here</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;