import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Search, Filter } from 'lucide-react';
import { getTickets } from '../utils/mockData';

/* 
  My Tickets Component.
  Updated: Uses shared mockData utility.
*/
const MyTickets = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        setTickets(getTickets());
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'On Hold': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-bold">My Tickets</h2>

                <div className="flex gap-4">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>

                    <button className="btn bg-white border border-gray-200 flex items-center gap-2 text-secondary hover:text-primary">
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-white bg-opacity-30 text-left">
                                <th className="p-4 font-medium text-secondary">Ticket ID</th>
                                <th className="p-4 font-medium text-secondary">Subject</th>
                                <th className="p-4 font-medium text-secondary">Category</th>
                                <th className="p-4 font-medium text-secondary">Status</th>
                                <th className="p-4 font-medium text-secondary">Date</th>
                                <th className="p-4 font-medium text-secondary">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b border-gray-100 hover:bg-white hover:bg-opacity-40 transition-colors">
                                        <td className="p-4 font-bold text-primary">#{ticket.id}</td>
                                        <td className="p-4 font-medium">{ticket.subject}</td>
                                        <td className="p-4 text-secondary">{ticket.category}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-secondary text-sm">{ticket.date || 'Today'}</td>
                                        <td className="p-4">
                                            <button className="text-primary text-sm font-medium hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-secondary">No tickets found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};

export default MyTickets;
