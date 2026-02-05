import React, { createContext, useState, useContext } from "react";
import { loginUser, loginAdmin } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            try {
                const payload = JSON.parse(atob(storedToken.split('.')[1]));
                return { ...payload, isAdmin: payload.type === "admin" };
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);

            localStorage.setItem("token", data.access_token);
            setToken(data.access_token);

            // Decode token
            try {
                const payload = JSON.parse(atob(data.access_token.split('.')[1]));
                setUser({ ...payload, isAdmin: payload.type === "admin" });
            } catch (e) {
                console.error("Failed to decode token", e);
            }

            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
