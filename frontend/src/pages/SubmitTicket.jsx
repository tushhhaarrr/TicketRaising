
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createTicket, classifyTicket } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const categories = [
    { value: "billing", label: "Billing" },
    { value: "technical", label: "Technical" },
    { value: "account", label: "Account" },
    { value: "general", label: "General" },
];

const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
];

const SubmitTicket = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isClassifying, setIsClassifying] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("");

    const handleDescriptionBlur = async () => {
        if (!description || description.length < 5) return;

        // Prevent multiple calls if already classifying
        if (isClassifying) return;

        setIsClassifying(true);
        try {
            const result = await classifyTicket(description);
            if (result.suggested_category) {
                setCategory(result.suggested_category);
            }
            if (result.suggested_priority) {
                setPriority(result.suggested_priority);
            }
            toast({
                title: "AI Suggestion Applied",
                description: `Category set to ${result.suggested_category}, Priority to ${result.suggested_priority}`,
            });
        } catch (error) {
            console.error("Classification failed", error);
        } finally {
            setIsClassifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createTicket({
                title,
                description,
                category,
                priority
            });

            toast({
                title: "Ticket Submitted!",
                description: "Your ticket has been created successfully.",
            });

            // Navigate to view tickets or dashboard
            navigate("/view-tickets");
        } catch (error) {
            toast({
                title: "Submission Failed",
                description: "There was an error submitting your ticket. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-light via-background to-info-light">
            <Header />

            <main className="flex-1 py-12">
                <div className="container">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
                            <h1 className="text-2xl font-bold text-foreground mb-2">Submit a Ticket</h1>
                            <p className="text-muted-foreground mb-8">Describe your issue and we'll help you resolve it.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Brief summary of the issue"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        maxLength={200}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="description">Description</Label>
                                        {isClassifying && (
                                            <span className="text-xs text-primary flex items-center gap-1">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Analyzing...
                                            </span>
                                        )}
                                    </div>
                                    <Textarea
                                        id="description"
                                        placeholder="Detailed description..."
                                        rows={6}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        onBlur={handleDescriptionBlur}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        AI will suggest Category and Priority after you finish typing.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={category} onValueChange={setCategory} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select value={priority} onValueChange={setPriority} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {priorities.map((p) => (
                                                    <SelectItem key={p.value} value={p.value}>
                                                        {p.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Ticket"
                                        )}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SubmitTicket;
