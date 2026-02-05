import React from "react";
import { Droplets, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

/**
 * Footer component.
 */
const Footer = () => {
    return (
        <footer className="border-t border-border bg-card py-12">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-light">
                            <Droplets className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-lg font-bold text-primary">Quick Smart Wash</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Follow Us</span>
                        <div className="flex items-center gap-2">
                            {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card hover:bg-muted transition-colors"
                                >
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    © 2024 Quick Smart Wash. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
