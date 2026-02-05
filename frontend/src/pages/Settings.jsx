import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bell, Shield, Palette } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        ticketUpdates: true,
        marketing: false,
    });

    const handleSave = () => {
        toast({
            title: "Settings Saved",
            description: "Your preferences have been updated successfully.",
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-12">
                <div className="container max-w-4xl">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
                    <p className="text-muted-foreground mb-8">
                        Manage your account settings and preferences
                    </p>

                    <Tabs defaultValue="profile" className="space-y-8">
                        <TabsList className="bg-card shadow-card p-1 h-auto">
                            <TabsTrigger value="profile" className="gap-2 py-2.5">
                                <User className="h-4 w-4" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="gap-2 py-2.5">
                                <Bell className="h-4 w-4" />
                                Notifications
                            </TabsTrigger>
                            <TabsTrigger value="security" className="gap-2 py-2.5">
                                <Shield className="h-4 w-4" />
                                Security
                            </TabsTrigger>
                            <TabsTrigger value="appearance" className="gap-2 py-2.5">
                                <Palette className="h-4 w-4" />
                                Appearance
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <div className="bg-card rounded-xl p-8 shadow-card space-y-6">
                                <div className="flex items-center gap-6">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>TC</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Button variant="outline" size="sm">
                                            Change Photo
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            JPG, GIF or PNG. Max size 2MB.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" defaultValue="Tushar" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" defaultValue="Choudhary" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue="tushar@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" defaultValue="+1 (555) 123-4567" />
                                    </div>
                                </div>

                                <Button onClick={handleSave} className="shadow-button">
                                    Save Changes
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="notifications">
                            <div className="bg-card rounded-xl p-8 shadow-card space-y-6">
                                <h2 className="text-lg font-semibold text-foreground">
                                    Notification Preferences
                                </h2>

                                <div className="space-y-4">
                                    {[
                                        {
                                            key: "email",
                                            label: "Email Notifications",
                                            description: "Receive email updates about your tickets",
                                        },
                                        {
                                            key: "push",
                                            label: "Push Notifications",
                                            description: "Receive push notifications in your browser",
                                        },
                                        {
                                            key: "ticketUpdates",
                                            label: "Ticket Updates",
                                            description: "Get notified when your ticket status changes",
                                        },
                                        {
                                            key: "marketing",
                                            label: "Marketing Emails",
                                            description: "Receive news and promotional content",
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.key}
                                            className="flex items-center justify-between p-4 rounded-lg border border-border"
                                        >
                                            <div>
                                                <p className="font-medium text-foreground">{item.label}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <Switch
                                                checked={notifications[item.key]}
                                                onCheckedChange={(checked) =>
                                                    setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>

                                <Button onClick={handleSave} className="shadow-button">
                                    Save Preferences
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="security">
                            <div className="bg-card rounded-xl p-8 shadow-card space-y-6">
                                <h2 className="text-lg font-semibold text-foreground">
                                    Security Settings
                                </h2>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input id="currentPassword" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input id="newPassword" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input id="confirmPassword" type="password" />
                                    </div>
                                </div>

                                <Button onClick={handleSave} className="shadow-button">
                                    Update Password
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="appearance">
                            <div className="bg-card rounded-xl p-8 shadow-card">
                                <h2 className="text-lg font-semibold text-foreground mb-4">
                                    Appearance Settings
                                </h2>
                                <p className="text-muted-foreground">
                                    Theme customization options coming soon.
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Settings;
