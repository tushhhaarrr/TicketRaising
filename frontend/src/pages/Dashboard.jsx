import React from 'react';
import GlassCard from '../components/GlassCard';
import { Ticket, CheckCircle, Clock } from 'lucide-react';

/* 
  Dashboard Component.
  Reason: Admin aur User ko key metrics at a glance dikhane ke liye.
*/
const Dashboard = () => {
    /* 
       Stats Data Mocking.
       Reason: Backend integration se pehle UI skeleton ready kar rahe hain.
    */
    const stats = [
        {
            title: 'Total Tickets',
            value: 24,
            icon: <Ticket size={24} color="var(--primary)" />,
            desc: 'All time tickets raised'
        },
        {
            title: 'Pending',
            value: 12,
            icon: <Clock size={24} color="#F59E0B" />, // Amber color
            desc: 'Awaiting action'
        },
        {
            title: 'Resolved',
            value: 8,
            icon: <CheckCircle size={24} color="#10B981" />, // Emerald color
            desc: 'Successfully closed'
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div>
                <h2 className="text-3xl font-bold">Dashboard</h2>
                <p className="text-secondary">Welcome back, Admin.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md-grid-cols-3">
                {stats.map((stat, index) => (
                    /* 
                       GlassCard use kar rahe hain stat box ke liye.
                       Delay staggar kar rahe hain (0.1, 0.2, 0.3) smooth entry for har card.
                    */
                    <GlassCard key={index} delay={index * 0.1} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-secondary font-medium">{stat.title}</span>
                            <div className="p-2 rounded-full bg-white bg-opacity-50">
                                {stat.icon}
                            </div>
                        </div>
                        <span className="text-4xl font-bold">{stat.value}</span>
                        <span className="text-sm text-secondary mt-1">{stat.desc}</span>
                    </GlassCard>
                ))}
            </div>

            {/* Recent Activity Section */}
            <GlassCard className="mt-4" delay={0.4}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Recent Tickets</h3>
                    <button className="text-primary font-medium text-sm">View All</button>
                </div>

                <div className="flex flex-col">
                    {/* Mock Activity List */}
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center p-4"
                            style={{ borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
                        >
                            <div className="flex items-center gap-4">
                                {/* Status Indicator Dot */}
                                <div className={`w-3 h-3 rounded-full ${i === 2 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                    style={{ backgroundColor: i === 2 ? '#10B981' : '#F59E0B' }}></div>

                                <div>
                                    <p className="font-bold text-main">Hardware Malfunction #{100 + i}</p>
                                    <p className="text-sm text-secondary">Reported by User A</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-main">Today</p>
                                <p className="text-xs text-secondary">2 hours ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export default Dashboard;
