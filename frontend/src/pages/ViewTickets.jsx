
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTickets, updateTicket } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Search, Loader2, Eye } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

const ViewTickets = () => {
    const { toast } = useToast();
    const { user } = useAuth(); // Get user to check role
    const queryClient = useQueryClient();
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Filter State
    const [filters, setFilters] = useState({
        search: "",
        category: "all",
        priority: "all",
        status: "all"
    });

    // Debounce search? For simplicity, using controlled input that triggers refetch on change/blur or just let React Query handle it if fast enough. 
    // Ideally debounce. But I'll just pass filters directly.

    const { data: tickets = [], isLoading, error } = useQuery({
        queryKey: ["tickets", filters],
        queryFn: () => getTickets(filters),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ ticketId, status }) => updateTicket(ticketId, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(["tickets"]);
            toast({
                title: "Status Updated",
                description: "Ticket status has been updated successfully.",
            });
        },
        onError: (error) => {
            toast({
                title: "Update Failed",
                description: "Failed to update status",
                variant: "destructive",
            });
        },
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "open": return "bg-blue-100 text-blue-800";
            case "in_progress": return "bg-yellow-100 text-yellow-800";
            case "resolved": return "bg-green-100 text-green-800";
            case "closed": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "critical": return "text-red-600 font-bold";
            case "high": return "text-orange-500 font-medium";
            case "medium": return "text-yellow-600";
            case "low": return "text-green-600";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-12">
                <div className="container">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Ticket List</h1>
                        <Button asChild>
                            <Link to="/submit-ticket">New Ticket</Link>
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="bg-card rounded-xl p-4 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                className="pl-10"
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                            />
                        </div>

                        <Select value={filters.category} onValueChange={(val) => handleFilterChange("category", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="billing">Billing</SelectItem>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="account">Account</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.priority} onValueChange={(val) => handleFilterChange("priority", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.status} onValueChange={(val) => handleFilterChange("status", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="bg-card rounded-xl shadow overflow-hidden">
                        {isLoading ? (
                            <div className="p-8 flex justify-center">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="p-8 text-center text-destructive">Error loading tickets</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tickets.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6">
                                                No tickets found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        tickets.map((ticket) => (
                                            <TableRow key={ticket.id}>
                                                <TableCell className="font-medium">
                                                    <div>{ticket.title}</div>
                                                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                        {ticket.description}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="capitalize">{ticket.category}</TableCell>
                                                <TableCell className={`capitalize ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
                                                        {ticket.status.replace('_', ' ')}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {new Date(ticket.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setSelectedTicket(ticket)}
                                                            className="h-8 w-8"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {user?.isAdmin && (
                                                            <Select
                                                                defaultValue={ticket.status}
                                                                onValueChange={(val) => updateStatusMutation.mutate({ ticketId: ticket.id, status: val })}
                                                            >
                                                                <SelectTrigger className="h-8 w-[130px]">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="open">Open</SelectItem>
                                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                                    <SelectItem value="resolved">Resolved</SelectItem>
                                                                    <SelectItem value="closed">Closed</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </main>
            {selectedTicket && (
                <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Ticket History</DialogTitle>
                            <DialogDescription>
                                Actions performed on ticket #{selectedTicket.id}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {selectedTicket.status_logs && selectedTicket.status_logs.length > 0 ? (
                                <div className="border rounded-md divide-y">
                                    {selectedTicket.status_logs.map((log) => (
                                        <div key={log.id} className="p-3 text-sm flex flex-col gap-1">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium capitalize">
                                                    {log.old_status?.replace('_', ' ') || 'Created'} &rarr; {log.new_status.replace('_', ' ')}
                                                </span>
                                                <span className="text-muted-foreground text-xs">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            {log.changed_by_admin_id && (
                                                <div className="text-xs text-muted-foreground">
                                                    Action by Admin
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-8">
                                    No status changes recorded.
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <Footer />
        </div>
    );
};

export default ViewTickets;
