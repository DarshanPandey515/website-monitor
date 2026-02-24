import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Icons from 'phosphor-react';
import { fetchWebsiteId } from '../utils/websiteService';
import { useQuery, useQueryClient } from '@tanstack/react-query'


const DetailWebsitePage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const [timeRange, setTimeRange] = useState('24h');
    const [selectedTab, setSelectedTab] = useState('overview');

    const { data, isLoading } = useQuery({
        queryKey: ["website", id],
        queryFn: () => fetchWebsiteId(id),
        enabled: !!id,

    })

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-zinc-100 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );


    const websiteData = {
        id: id,
        name: data.website_name,
        url: data.website_url,
        status: 'operational',
        uptime: '99.98%',
        responseTime: '124ms',
        lastChecked: '2 minutes ago',
        certificateExpiry: '45 days',
        currentIncident: null,
        ssl: {
            issuer: 'Let\'s Encrypt',
            expiresIn: '45 days',
            valid: true
        },
        dns: {
            records: ['A: 93.184.216.34', 'MX: mail.example.com'],
            provider: 'Cloudflare'
        }
    };

    // Mock uptime history
    const uptimeHistory = [
        { time: '00:00', uptime: 100, response: 120 },
        { time: '01:00', uptime: 99.9, response: 145 },
        { time: '02:00', uptime: 100, response: 118 },
        { time: '03:00', uptime: 100, response: 122 },
        { time: '04:00', uptime: 98.5, response: 234 },
        { time: '05:00', uptime: 100, response: 119 },
        { time: '06:00', uptime: 100, response: 121 },
        { time: '07:00', uptime: 99.8, response: 156 },
        { time: '08:00', uptime: 100, response: 118 },
        { time: '09:00', uptime: 100, response: 124 },
        { time: '10:00', uptime: 100, response: 119 },
        { time: '11:00', uptime: 99.7, response: 189 }
    ];

    // Mock recent checks
    const recentChecks = [
        { time: '2 min ago', status: 'up', response: '124ms', statusCode: 200 },
        { time: '7 min ago', status: 'up', response: '118ms', statusCode: 200 },
        { time: '12 min ago', status: 'up', response: '131ms', statusCode: 200 },
        { time: '17 min ago', status: 'up', response: '122ms', statusCode: 200 },
        { time: '22 min ago', status: 'degraded', response: '2.3s', statusCode: 200 },
        { time: '27 min ago', status: 'up', response: '127ms', statusCode: 200 },
        { time: '32 min ago', status: 'up', response: '119ms', statusCode: 200 },
        { time: '37 min ago', status: 'up', response: '126ms', statusCode: 200 },
        { time: '42 min ago', status: 'up', response: '121ms', statusCode: 200 },
        { time: '47 min ago', status: 'up', response: '129ms', statusCode: 200 }
    ];

    // Mock incidents
    const incidents = [
        {
            id: 1,
            title: 'High Response Time',
            status: 'resolved',
            severity: 'medium',
            startTime: '2024-01-15 14:30',
            endTime: '2024-01-15 15:45',
            duration: '1h 15m',
            description: 'Response time spiked to 2.3s due to database connection issues'
        },
        {
            id: 2,
            title: 'Service Unavailable',
            status: 'resolved',
            severity: 'high',
            startTime: '2024-01-14 09:20',
            endTime: '2024-01-14 10:05',
            duration: '45m',
            description: 'Website was down due to server restart'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'operational':
            case 'up': return 'text-green-400';
            case 'degraded': return 'text-yellow-400';
            case 'down': return 'text-red-400';
            case 'maintenance': return 'text-blue-400';
            default: return 'text-zinc-400';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'operational':
            case 'up': return 'bg-green-500/10';
            case 'degraded': return 'bg-yellow-500/10';
            case 'down': return 'bg-red-500/10';
            case 'maintenance': return 'bg-blue-500/10';
            default: return 'bg-zinc-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'operational':
            case 'up': return <Icons.CheckCircle size={20} className="text-green-400" weight="fill" />;
            case 'degraded': return <Icons.Warning size={20} className="text-yellow-400" weight="fill" />;
            case 'down': return <Icons.XCircle size={20} className="text-red-400" weight="fill" />;
            case 'maintenance': return <Icons.Wrench size={20} className="text-blue-400" weight="fill" />;
            default: return <Icons.Question size={20} className="text-zinc-400" weight="fill" />;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-red-400 bg-red-500/10';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10';
            case 'low': return 'text-blue-400 bg-blue-500/10';
            default: return 'text-zinc-400 bg-zinc-800';
        }
    };

    return (
        <div className="p-8">
            {/* Header with navigation */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/dashboard/websites')}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <Icons.ArrowLeft size={20} className="text-zinc-400" weight="bold" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold mb-1">{websiteData.name}</h1>
                        <div className="flex items-center space-x-3">
                            <a
                                href={websiteData.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center space-x-1"
                            >
                                <Icons.Link size={16} weight="bold" />
                                <span>{websiteData.url}</span>
                            </a>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-400">ID: {websiteData.id}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors flex items-center space-x-2">
                        <Icons.Pause size={18} weight="bold" />
                        <span>Pause Monitoring</span>
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors flex items-center space-x-2">
                        <Icons.ArrowsClockwise size={18} weight="bold" />
                        <span>Check Now</span>
                    </button>
                </div>
            </div>

            {/* Status Banner */}
            <div className={`mb-6 p-4 rounded-lg ${getStatusBg(websiteData.status)} border ${getStatusColor(websiteData.status).replace('text', 'border')}/20`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {getStatusIcon(websiteData.status)}
                        <div>
                            <p className={`font-medium ${getStatusColor(websiteData.status)}`}>
                                {websiteData.status === 'operational' ? 'All Systems Operational' :
                                    websiteData.status === 'degraded' ? 'Performance Degraded' :
                                        websiteData.status === 'down' ? 'Website is Down' : 'Under Maintenance'}
                            </p>
                            <p className="text-sm text-zinc-400">
                                Last checked: {websiteData.lastChecked}
                            </p>
                        </div>
                    </div>
                    {websiteData.currentIncident && (
                        <div className="flex items-center space-x-2">
                            <Icons.Warning size={16} className="text-yellow-400" weight="fill" />
                            <span className="text-sm text-yellow-400">Active Incident</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-zinc-400 text-sm mb-1">Uptime (30d)</p>
                            <p className="text-2xl font-bold text-green-400">{websiteData.uptime}</p>
                        </div>
                        <Icons.ArrowCircleUp size={24} className="text-green-400" weight="bold" />
                    </div>
                </div>
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-zinc-400 text-sm mb-1">Avg Response Time</p>
                            <p className="text-2xl font-bold text-blue-400">{websiteData.responseTime}</p>
                        </div>
                        <Icons.Gauge size={24} className="text-blue-400" weight="bold" />
                    </div>
                </div>
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-zinc-400 text-sm mb-1">SSL Certificate</p>
                            <p className={`text-2xl font-bold ${websiteData.ssl.valid ? 'text-green-400' : 'text-red-400'}`}>
                                {websiteData.ssl.expiresIn}
                            </p>
                        </div>
                        <Icons.Lock size={24} className="text-green-400" weight="bold" />
                    </div>
                </div>
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-zinc-400 text-sm mb-1">Total Checks (30d)</p>
                            <p className="text-2xl font-bold text-purple-400">8,640</p>
                        </div>
                        <Icons.Clock size={24} className="text-purple-400" weight="bold" />
                    </div>
                </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                    {['1h', '6h', '24h', '7d', '30d'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${timeRange === range
                                ? 'bg-zinc-700 text-white'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                        <Icons.DownloadSimple size={18} className="text-zinc-400" weight="bold" />
                    </button>
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                        <Icons.ClockCounterClockwise size={18} className="text-zinc-400" weight="bold" />
                    </button>
                </div>
            </div>

            {/* Response Time Chart */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Response Time History</h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            <span className="text-sm text-zinc-400">Response Time</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="text-sm text-zinc-400">Uptime</span>
                        </div>
                    </div>
                </div>
                <div className="h-64 relative">
                    {/* Simple chart visualization - replace with actual chart library */}
                    <div className="absolute inset-0 flex items-end justify-between">
                        {uptimeHistory.map((point, index) => (
                            <div key={index} className="flex flex-col items-center w-8">
                                <div className="relative w-full flex justify-center">
                                    <div
                                        className="w-1 bg-blue-500 rounded-t"
                                        style={{ height: `${(point.response / 250) * 100}px` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-zinc-600 mt-2">{point.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-zinc-800 mb-6">
                <div className="flex space-x-6">
                    {[
                        { id: 'overview', label: 'Overview', icon: Icons.Globe },
                        { id: 'checks', label: 'Recent Checks', icon: Icons.Clock },
                        { id: 'incidents', label: 'Incidents', icon: Icons.Warning },
                        { id: 'security', label: 'Security', icon: Icons.Shield },
                        { id: 'settings', label: 'Settings', icon: Icons.Gear }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}
                            className={`pb-4 px-1 flex items-center space-x-2 border-b-2 transition-colors ${selectedTab === tab.id
                                ? 'border-blue-500 text-white'
                                : 'border-transparent text-zinc-400 hover:text-white'
                                }`}
                        >
                            <tab.icon size={18} weight={selectedTab === tab.id ? 'fill' : 'bold'} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {selectedTab === 'overview' && (
                    <>
                        {/* Performance Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                                <h3 className="font-semibold mb-4">Performance Metrics</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-zinc-400">Avg Response Time (24h)</span>
                                            <span className="text-white">156ms</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-zinc-400">Peak Response Time</span>
                                            <span className="text-white">2.3s</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-2">
                                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-zinc-400">Success Rate</span>
                                            <span className="text-white">99.8%</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '99%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SSL & Security Info */}
                            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                                <h3 className="font-semibold mb-4">SSL Certificate</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-400">Issuer</span>
                                        <span className="text-white">{websiteData.ssl.issuer}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-400">Expires In</span>
                                        <span className="text-green-400">{websiteData.ssl.expiresIn}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-400">Status</span>
                                        <span className="text-green-400 flex items-center space-x-1">
                                            <Icons.CheckCircle size={16} weight="fill" />
                                            <span>Valid</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DNS Records */}
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                            <h3 className="font-semibold mb-4">DNS Records</h3>
                            <div className="space-y-2">
                                {websiteData.dns.records.map((record, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                        <Icons.Database size={16} className="text-zinc-500" weight="bold" />
                                        <span className="text-zinc-300">{record}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {selectedTab === 'checks' && (
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                            <h3 className="font-semibold">Recent Checks</h3>
                            <div className="flex items-center space-x-2">
                                <select className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm">
                                    <option>All Status</option>
                                    <option>Success</option>
                                    <option>Degraded</option>
                                    <option>Failed</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-zinc-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Response Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Status Code</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {recentChecks.map((check, index) => (
                                        <tr key={index} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm">{check.time}</td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center space-x-1 ${getStatusColor(check.status)}`}>
                                                    {getStatusIcon(check.status)}
                                                    <span className="text-sm capitalize">{check.status}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{check.response}</td>
                                            <td className="px-6 py-4 text-sm">{check.statusCode}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {selectedTab === 'incidents' && (
                    <div className="space-y-4">
                        {incidents.map((incident) => (
                            <div key={incident.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="font-semibold">{incident.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(incident.severity)}`}>
                                                {incident.severity} severity
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-400">{incident.description}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">
                                        {incident.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-zinc-500 block">Started</span>
                                        <span className="text-zinc-300">{incident.startTime}</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500 block">Ended</span>
                                        <span className="text-zinc-300">{incident.endTime}</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500 block">Duration</span>
                                        <span className="text-zinc-300">{incident.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedTab === 'security' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                            <h3 className="font-semibold mb-4">Security Headers</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">HSTS</span>
                                    <span className="text-green-400">Enabled</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">X-Frame-Options</span>
                                    <span className="text-green-400">SAMEORIGIN</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">X-Content-Type-Options</span>
                                    <span className="text-green-400">nosniff</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">CSP</span>
                                    <span className="text-yellow-400">Missing</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                            <h3 className="font-semibold mb-4">Recommendations</h3>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <Icons.Shield size={18} className="text-yellow-400 flex-shrink-0" weight="fill" />
                                    <span className="text-sm text-zinc-300">Implement Content Security Policy</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Icons.Lock size={18} className="text-green-400 flex-shrink-0" weight="fill" />
                                    <span className="text-sm text-zinc-300">SSL certificate is valid and up to date</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTab === 'settings' && (
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                        <h3 className="font-semibold mb-4">Monitoring Settings</h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Check Interval</label>
                                    <select className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg">
                                        <option>Every 1 minute</option>
                                        <option>Every 5 minutes</option>
                                        <option selected>Every 15 minutes</option>
                                        <option>Every 30 minutes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Timeout (seconds)</label>
                                    <input type="number" defaultValue="30" className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Expected Status Code</label>
                                <input type="number" defaultValue="200" className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg" />
                            </div>
                            <div className="flex items-center space-x-3">
                                <input type="checkbox" id="alerts" className="rounded bg-zinc-800 border-zinc-700" />
                                <label htmlFor="alerts" className="text-sm text-zinc-300">Enable alerts for this website</label>
                            </div>
                            <div className="pt-4 flex space-x-3">
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">
                                    Save Changes
                                </button>
                                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">
                                    Reset to Default
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailWebsitePage;