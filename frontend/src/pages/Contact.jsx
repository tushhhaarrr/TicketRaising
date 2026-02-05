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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
    {
        icon: Mail,
        title: "Email Us",
        description: "Our team is here to help",
        link: "support@quicksmartwash.com",
        variant: "Blue",
    },
    {
        icon: Phone,
        title: "Call Us",
        description: "Mon-Fri from 8am to 6pm",
        link: "+919929922240",
        variant: "info",
    },
    {
        icon: MapPin,
        title: "Visit Us",
        description: "Come say hello at our office",
        link: "Floor, P, 2nd & 3rd, 53/210, VT Rd, Mansarovar,\nJaipur, Rajasthan 302020, India",
        variant: "success",
    },
];

const faqs = [
    {
        question: "How quickly will I get a response?",
        answer:
            "We typically respond to all inquiries within 2-4 hours during business hours. For urgent matters, please call us directly.",
    },
    {
        question: "What are your support hours?",
        answer:
            "Our support team is available Monday through Friday, 8:00 AM to 6:00 PM EST. Emergency support is available 24/7.",
    },
    {
        question: "Can I schedule a demo?",
        answer:
            "Yes! Contact us to schedule a personalized demo of our ticket management platform with one of our specialists.",
    },
    {
        question: "Do you offer training?",
        answer:
            "We provide comprehensive training for all new users and ongoing support to ensure your team gets the most out of our platform.",
    },
];

const subjects = [
    "General Inquiry",
    "Technical Support",
    "Billing Question",
    "Feature Request",
    "Partnership",
    "Other",
];

const Contact = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast({
            title: "Message Sent!",
            description: "Thank you for reaching out. We'll get back to you soon.",
        });

        setIsSubmitting(false);
        e.target.reset();
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-12">
                <div className="container">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Have questions? We're here to help and answer any questions you might have
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-16">
                        {/* Contact Form */}
                        <div className="lg:col-span-2 bg-card rounded-2xl p-8 shadow-card">
                            <h2 className="text-xl font-semibold text-foreground mb-6">
                                Send us a Message
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Your Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input id="name" placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email Address <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">
                                        Subject <span className="text-destructive">*</span>
                                    </Label>
                                    <Select required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((subject) => (
                                                <SelectItem
                                                    key={subject}
                                                    value={subject.toLowerCase().replace(/\s+/g, "-")}
                                                >
                                                    {subject}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">
                                        Message <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us how we can help you..."
                                        rows={6}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full shadow-button" disabled={isSubmitting}>
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="space-y-4">
                            {contactInfo.map((info) => (
                                <div
                                    key={info.title}
                                    className="bg-card rounded-xl p-6 shadow-card"
                                >
                                    <IconBox icon={info.icon} variant={info.variant} size="lg" />
                                    <h3 className="font-semibold text-foreground mt-4 mb-1">
                                        {info.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {info.description}
                                    </p>
                                    <a
                                        href="#"
                                        className="text-sm text-primary hover:underline break-all"
                                    >
                                        {info.link}
                                    </a>
                                </div>
                            ))}

                            {/* Social Links */}
                            <div className="bg-card rounded-xl p-6 shadow-card">
                                <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                                <div className="flex gap-2">
                                    {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card hover:bg-muted transition-colors"
                                        >
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
                            Frequently Asked Questions
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-card rounded-xl p-6 shadow-card">
                                    <h3 className="font-semibold text-foreground mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </p>
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

export default Contact;
