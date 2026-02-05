import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
            navigate("/dashboard");
        } catch (error) {
            toast({
                title: "Login Failed",
                description: error.response?.data?.detail || "Invalid credentials",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-card">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
                        <p className="text-muted-foreground mt-2">
                            Enter your credentials to access your account
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full shadow-button"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
