import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { IconBox } from "@/components/ui/icon-box";
import { Link } from "react-router-dom";
import { Zap, Shield, BarChart3, ArrowRight } from "lucide-react";

/**
 * Index (Home) Page Component
 */
const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description:
            "Submit and track tickets in seconds with our optimized workflow. Real-time updates keep everyone in sync.",
        variant: "teal",
    },
    {
        icon: Shield,
        title: "Secure & Reliable",
        description:
            "Enterprise-grade security with role-based access control. Your data is protected with industry standards.",
        variant: "info",
    },
    {
        icon: BarChart3,
        title: "Smart Analytics",
        description:
            "Comprehensive dashboards with real-time metrics. Make data-driven decisions to improve efficiency.",
        variant: "success",
    },
];

const stats = [
    { value: "1,247", label: "Tickets Resolved" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "2.5h", label: "Avg Response Time" },
    { value: "24/7", label: "Support Available" },
];

const Index = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="gradient-hero py-20 md:py-28">
                    <div className="container text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
                            Ticket Management
                            <br />
                            <span className="text-primary">Made Simple</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
                            Streamline your internal issue tracking and resolution with our premium
                            glassmorphism-powered platform. Fast, reliable, and beautifully designed for
                            modern teams.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                            <Button asChild size="lg" className="shadow-button">
                                <Link to="/submit-ticket">
                                    Raise a Ticket
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link to="/view-tickets">View All Tickets</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-background">
                    <div className="container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                Why Choose Our Platform?
                            </h2>
                            <p className="text-muted-foreground">
                                Experience the future of ticket management
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all"
                                >
                                    <IconBox icon={feature.icon} variant={feature.variant} size="lg" />
                                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="gradient-stats py-16">
                    <div className="container">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center text-white">
                                    <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                                    <p className="text-white/80 text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Index;
