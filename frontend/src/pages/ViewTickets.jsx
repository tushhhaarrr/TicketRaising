import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTickets, updateTicket } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, Plus, Loader2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const TicketDetailsModal = ({ ticket, isAdmin, onUpdateStatus }) => {
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Ticket Details</DialogTitle>
                <DialogDescription>
                    TKT-{ticket.id} - Created on {new Date(ticket.created_at).toLocaleDateString()}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Status</h4>
                    {isAdmin ? (
                        <Select
                            defaultValue={ticket.status}
                            onValueChange={(value) => onUpdateStatus(ticket.id, value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Process</SelectItem>
                                <SelectItem value="On Hold">On Hold</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <StatusBadge status={ticket.status} />
                    )}
                </div>
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Description / Query</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md min-h-[100px] whitespace-pre-wrap">
                        {ticket.description}
                    </p>
                </div>
                {/* File handling could go here later */}
            </div>
        </DialogContent>
    );
};

const ViewTickets = () => {
    const { user } = useAuth();
    const isAdmin = user?.isAdmin;
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: tickets, isLoading, error } = useQuery({
        queryKey: ["tickets"],
        queryFn: getTickets,
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
                description: error.response?.data?.detail || "Failed to update status",
                variant: "destructive",
            });
        },
    });

    const handleUpdateStatus = (ticketId, status) => {
        updateStatusMutation.mutate({ ticketId, status });
    };

    const [selectedTicket, setSelectedTicket] = useState(null);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-destructive">Failed to load tickets. Please try again later.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-12">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">View Tickets</h1>
                            <p className="text-muted-foreground mt-1">
                                Manage and track all your support tickets
                            </p>
                        </div>
                        {!isAdmin && (
                            <Button asChild className="shadow-button">
                                <Link to="/submit-ticket">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Ticket
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="bg-card rounded-xl p-4 shadow-card mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search tickets..." className="pl-10" />
                            </div>
                            <Select>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="on-hold">On Hold</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Tickets Table */}
                    <div className="bg-card rounded-xl shadow-card overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold">ID</TableHead>
                                    <TableHead className="font-semibold">Description</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    <TableHead className="font-semibold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow key={ticket.id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium text-primary">
                                            TKT-{ticket.id}
                                        </TableCell>
                                        <TableCell className="max-w-md truncate">
                                            {ticket.description}
                                        </TableCell>
                                        <TableCell>
                                            {isAdmin ? (
                                                <Select
                                                    defaultValue={ticket.status}
                                                    onValueChange={(value) => handleUpdateStatus(ticket.id, value)}
                                                >
                                                    <SelectTrigger className="w-[140px] h-8">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Pending">Pending</SelectItem>
                                                        <SelectItem value="In Progress">In Process</SelectItem>
                                                        <SelectItem value="On Hold">On Hold</SelectItem>
                                                        <SelectItem value="Resolved">Resolved</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <StatusBadge status={ticket.status} />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setSelectedTicket(ticket)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <TicketDetailsModal
                                                    ticket={ticket}
                                                    isAdmin={isAdmin}
                                                    onUpdateStatus={handleUpdateStatus}
                                                />
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ViewTickets;
