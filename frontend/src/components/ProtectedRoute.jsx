import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth(); // Assuming useAuth provides loading if it checks token on mount asynchronously, but currently it's sync from localStorage.

    // If we had async token validation:
    // if (loading) return <Loader2 className="animate-spin h-8 w-8 mx-auto mt-20" />;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
