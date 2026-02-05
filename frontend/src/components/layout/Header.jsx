import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Droplets } from "lucide-react";

/**
 * Header component for the application.
 * Contains navigation links and the logo.
 */
const navItems = [
    { name: "Home", path: "/" },
    { name: "Submit Ticket", path: "/submit-ticket" },
    { name: "View Tickets", path: "/view-tickets" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Settings", path: "/settings" },
    { name: "Contact", path: "/contact" },
];

import { useAuth } from "@/context/AuthContext";

import { ThemeToggle } from "@/components/ui/theme-toggle";

import logo from "@/assets/logo.png";

const Header = () => {
    const location = useLocation();
    const { user } = useAuth();
    const isAdmin = user?.isAdmin;

    const filteredNavItems = navItems.filter(item => {
        if (isAdmin && item.path === "/submit-ticket") return false;
        return true;
    });

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Quick Smart Wash" className="h-10 w-10 rounded-full object-cover" />
                    <span className="text-lg font-bold text-primary">Quick Smart Wash</span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    <ThemeToggle />
                    {filteredNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
};

export default Header;
