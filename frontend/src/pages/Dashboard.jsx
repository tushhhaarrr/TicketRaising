
import { useQuery } from "@tanstack/react-query";
import { getTicketStats } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { StatCard } from "@/components/ui/stat-card";
import { Loader2, AlertCircle, FileText, CheckCircle2, Clock, BarChart3 } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const Dashboard = () => {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ["ticketStats"],
        queryFn: getTicketStats,
        refetchInterval: 30000,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-destructive">
                <AlertCircle className="h-6 w-6 mr-2" />
                Failed to load dashboard stats.
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-8 container">
                <h1 className="text-3xl font-bold mb-6">Support Dashboard</h1>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        label="Total Tickets"
                        value={stats.total_tickets}
                        icon={FileText}
                        variant="default"
                    />
                    <StatCard
                        label="Open Tickets"
                        value={stats.open_tickets}
                        icon={Clock}
                        variant="warning"
                    />
                    <StatCard
                        label="Avg Tickets/Day"
                        value={stats.avg_tickets_per_day}
                        icon={BarChart3}
                        variant="info"
                    />
                    <StatCard
                        label="Resolved Rate"
                        value={`${stats.total_tickets > 0 ? Math.round(((stats.total_tickets - stats.open_tickets) / stats.total_tickets) * 100) : 0}%`}
                        icon={CheckCircle2}
                        variant="success"
                    />
                </div>

                {/* Charts / Breakdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Priority Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tickets by Priority</CardTitle>
                            <CardDescription>Distribution of ticket urgency</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(stats.priority_breakdown).map(([priority, count]) => (
                                    <div key={priority} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-2 ${priority === 'critical' ? 'bg-red-500' :
                                                    priority === 'high' ? 'bg-orange-500' :
                                                        priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                }`} />
                                            <span className="capitalize">{priority}</span>
                                        </div>
                                        <span className="font-bold">{count}</span>
                                    </div>
                                ))}
                                {Object.keys(stats.priority_breakdown).length === 0 && (
                                    <div className="text-muted-foreground text-sm">No data available</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tickets by Category</CardTitle>
                            <CardDescription>Distribution of ticket types</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(stats.category_breakdown).map(([category, count]) => (
                                    <div key={category} className="flex items-center justify-between">
                                        <span className="capitalize">{category}</span>
                                        <span className="font-bold">{count}</span>
                                    </div>
                                ))}
                                {Object.keys(stats.category_breakdown).length === 0 && (
                                    <div className="text-muted-foreground text-sm">No data available</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
