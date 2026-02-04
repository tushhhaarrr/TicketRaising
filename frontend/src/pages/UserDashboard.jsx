import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Plus, List, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTickets } from '../utils/mockData';

const UserDashboard = () => {
    const userName = localStorage.getItem('userName') || 'Employee';
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        setTickets(getTickets());
    }, []);

    const total = tickets.length;
    const resolved = tickets.filter(t => t.status === 'Resolved').length;
    const pending = tickets.filter(t => t.status === 'Pending').length;

    // Get recent 3 tickets
    const recentTickets = tickets.slice(0, 3);

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
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <div>
                    <h2 className="text-3xl font-bold">Hello, {userName}!</h2>
                    <p className="text-secondary">Here is what's happening with your requests.</p>
                </div>

                <Link to="/create-ticket" className="mt-4 md:mt-0 btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                    <Plus size={20} /> Raise a Ticket
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pending */}
                <GlassCard className="flex items-center gap-4 border-l-4 border-yellow-400">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">{pending}</h3>
                        <p className="text-secondary text-sm">Tickets Pending</p>
                    </div>
                </GlassCard>

                {/* Resolved */}
                <GlassCard className="flex items-center gap-4 border-l-4 border-green-500">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">{resolved}</h3>
                        <p className="text-secondary text-sm">Issues Solved</p>
                    </div>
                </GlassCard>

                {/* Total */}
                <GlassCard className="flex items-center gap-4 border-l-4 border-blue-500">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <List size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">{total}</h3>
                        <p className="text-secondary text-sm">Total Raised</p>
                    </div>
                </GlassCard>
            </div>

            <GlassCard className="mt-2" delay={0.2}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Your Recent Tickets</h3>
                    <Link to="/tickets" className="text-primary font-medium hover:underline">View All</Link>
                </div>

                <div className="flex flex-col gap-3">
                    {recentTickets.map((ticket, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white bg-opacity-40 hover:bg-opacity-80 transition-all border border-transparent hover:border-gray-200 cursor-pointer flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {ticket.status === 'Resolved' ? '✓' : '!'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-main">{ticket.subject}</h4>
                                    <p className="text-sm text-secondary">Raised {ticket.date} • {ticket.category}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export default UserDashboard;
