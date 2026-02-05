import { useQuery } from "@tanstack/react-query";
import { getTickets } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    FileText,
    CheckCircle2,
    Loader2,
    Clock,
    ArrowRight,
    AlertCircle,
    LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { data: tickets = [], isLoading, error } = useQuery({
        queryKey: ["tickets"],
        queryFn: getTickets,
    });

    const handleLogout = () => {
        logout();
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
        navigate("/login");
    };

    const totalTickets = tickets.length;
    const resolvedTickets = tickets.filter(t => t.status === "resolved").length;
    const processingTickets = tickets.filter(t => t.status === "processing").length;
    const pendingTickets = tickets.filter(t => t.status === "pending").length;

    const recentTickets = tickets.slice(0, 5);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-light via-background to-info-light">
            <Header />

            <main className="flex-1 py-12">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                            <p className="text-muted-foreground mt-1">
                                Overview of ticket management and performance
                            </p>
                        </div>
                        <Button onClick={handleLogout} variant="destructive" className="gap-2">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            icon={FileText}
                            value={totalTickets}
                            label="Total Tickets"
                            variant="teal"
                        />
                        <StatCard
                            icon={CheckCircle2}
                            value={resolvedTickets}
                            label="Resolved"
                            variant="success"
                        />
                        <StatCard
                            icon={Loader2}
                            value={processingTickets}
                            label="Processing"
                            variant="info"
                        />
                        <StatCard
                            icon={Clock}
                            value={pendingTickets}
                            label="Pending"
                            variant="pending"
                        />
                    </div>

                    {/* Recent Tickets */}
                    <div className="bg-card rounded-xl shadow-card overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-lg font-semibold text-foreground">Recent Tickets</h2>
                            <Link
                                to="/view-tickets"
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                                View All <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        {isLoading ? (
                            <div className="p-8 flex justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : error ? (
                            <div className="p-8 flex justify-center text-destructive">
                                <AlertCircle className="h-6 w-6 mr-2" />
                                Failed to load tickets
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">ID</TableHead>
                                        <TableHead className="font-semibold">Description</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTickets.map((ticket) => (
                                        <TableRow key={ticket.id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium text-primary">
                                                TKT-{ticket.id}
                                            </TableCell>
                                            <TableCell>{ticket.description}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={ticket.status} />
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {recentTickets.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                                No tickets found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
