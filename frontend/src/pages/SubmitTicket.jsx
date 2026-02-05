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
import { IconBox } from "@/components/ui/icon-box";
import { Clock, Bell, Headphones } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createTicket } from "@/lib/api";

const categories = [
    "Equipment Malfunction",
    "Facility Issue",
    "Technical Issue",
    "Supply Request",
    "Other",
];

const priorities = ["Low", "Medium", "High", "Critical"];

const benefits = [
    {
        icon: Clock,
        title: "Quick Response",
        description: "Average response time under 2 hours",
        variant: "teal",
    },
    {
        icon: Bell,
        title: "Real-time Updates",
        description: "Get notified on every status change",
        variant: "info",
    },
    {
        icon: Headphones,
        title: "Expert Support",
        description: "Dedicated team for each category",
        variant: "success",
    },
];

const SubmitTicket = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target);
        const title = formData.get("title") || "No Title";
        const category = formData.get("category") || "Other";
        const priority = formData.get("priority") || "Low";
        const description = formData.get("description");

        const fullDescription = `[Title: ${title}] ${description}`;

        try {
            await createTicket(fullDescription, category, priority, null); // Files temporarily null

            toast({
                title: "Ticket Submitted!",
                description: "Your ticket has been created successfully. We'll get back to you soon.",
            });

            e.target.reset();
        } catch {
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
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-card rounded-2xl p-8 shadow-card">
                            <h1 className="text-2xl font-bold text-foreground mb-6">Submit a Ticket</h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">
                                            Title <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="Brief description of the issue"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">
                                            Category <span className="text-destructive">*</span>
                                        </Label>
                                        <Select name="category" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">
                                        Priority <span className="text-destructive">*</span>
                                    </Label>
                                    <Select name="priority" defaultValue="Medium">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {priorities.map((priority) => (
                                                <SelectItem key={priority} value={priority}>
                                                    {priority}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Provide detailed information about the issue..."
                                        rows={6}
                                        required
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" className="flex-1 shadow-button" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit Ticket"}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Benefits */}
                        <div className="grid md:grid-cols-3 gap-6 mt-12">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit.title}
                                    className="bg-card rounded-xl p-6 shadow-card text-center"
                                >
                                    <IconBox
                                        icon={benefit.icon}
                                        variant={benefit.variant}
                                        size="lg"
                                        className="mx-auto"
                                    />
                                    <h3 className="font-semibold text-foreground mt-4 mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SubmitTicket;
