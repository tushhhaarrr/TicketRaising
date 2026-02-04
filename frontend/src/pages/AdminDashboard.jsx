import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Ticket, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { getTickets, updateTicketStatus } from '../utils/mockData';

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);

    // Load tickets on mount
    useEffect(() => {
        setTickets(getTickets());
    }, []);

    const handleStatusChange = (id, newStatus) => {
        const updated = updateTicketStatus(id, newStatus);
        setTickets(updated);
    };

    // Calculate dynamic stats
    const total = tickets.length;
    const solved = tickets.filter(t => t.status === 'Resolved').length;
    const pending = tickets.filter(t => t.status === 'Pending').length;

    const graphData = [
        { name: 'Jan', raised: 4, solved: 2 },
        { name: 'Feb', raised: 10, solved: 8 },
        { name: 'Mar', raised: 15, solved: 10 },
        { name: 'Apr', raised: 8, solved: 7 },
        { name: 'May', raised: 25, solved: 20 },
        { name: 'Jun', raised: 18, solved: 15 },
    ];

    const stats = [
        { title: 'Total Tickets', value: total, icon: <Ticket size={24} color="#007AFF" />, desc: 'All time' },
        { title: 'Solved', value: solved, icon: <CheckCircle size={24} color="#10B981" />, desc: 'Success Rate' },
        { title: 'Pending', value: pending, icon: <AlertCircle size={24} color="#F59E0B" />, desc: 'Needs Attention' },
        { title: 'Active Users', value: 24, icon: <Users size={24} color="#8B5CF6" />, desc: 'Employees' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'On Hold': return 'bg-orange-100 text-orange-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold">Admin Overview</h2>
                    <p className="text-secondary">System performance and ticket metrics.</p>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid gap-4 md-grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <GlassCard key={index} delay={index * 0.1}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-secondary text-sm font-medium">{stat.title}</p>
                                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                            </div>
                            <div className="p-2 rounded-lg bg-white bg-opacity-60">
                                {stat.icon}
                            </div>
                        </div>
                        <p className="text-xs text-secondary mt-2">{stat.desc}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Graph Section */}
            <GlassCard className="h-96" delay={0.4}>
                <h3 className="text-xl font-bold mb-6">Ticket Statistics (Monthly)</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={graphData}>
                        <defs>
                            <linearGradient id="colorRaised" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#007AFF" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="raised" stroke="#007AFF" fillOpacity={1} fill="url(#colorRaised)" strokeWidth={3} />
                        <Area type="monotone" dataKey="solved" stroke="#10B981" fillOpacity={1} fill="url(#colorSolved)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </GlassCard>

            {/* Recent Critical Tickets Table with Dropdown */}
            <GlassCard delay={0.5}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Recent Ticket Activities</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-secondary text-sm border-b border-gray-200">
                                <th className="p-3">ID</th>
                                <th className="p-3">Subject</th>
                                <th className="p-3">User</th>
                                <th className="p-3">Current Status</th>
                                <th className="p-3">Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="border-b border-gray-100 hover:bg-white hover:bg-opacity-40">
                                    <td className="p-3 text-sm text-secondary">#{ticket.id}</td>
                                    <td className="p-3 font-medium">{ticket.subject}</td>
                                    <td className="p-3 text-secondary">{ticket.user}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {/* Dropdown Menu for Status */}
                                        <select
                                            className="p-1 rounded border border-gray-300 bg-white text-sm"
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};

export default AdminDashboard;
