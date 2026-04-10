
import axios from "axios";

// Create axios instance
const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth
export const loginUser = async (email, password) => {
    // Using FormData for OAuth2 standard
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    const response = await api.post("/auth/login", formData);
    return response.data;
};

// Tickets
export const createTicket = async (ticketData) => {
    // ticketData: { title, description, category, priority }
    const response = await api.post("/tickets/", ticketData);
    return response.data;
};

export const getTickets = async (filters = {}) => {
    // filters: { category, priority, status, search }
    const params = new URLSearchParams();
    if (filters.category && filters.category !== "all") params.append("category", filters.category);
    if (filters.priority && filters.priority !== "all") params.append("priority", filters.priority);
    if (filters.status && filters.status !== "all") params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);

    const response = await api.get(`/tickets/?${params.toString()}`);
    return response.data;
};

export const updateTicket = async (ticketId, updateData) => {
    // updateData: { status, category, priority }
    const response = await api.patch(`/tickets/${ticketId}/`, updateData);
    return response.data;
};

export const getTicketStats = async () => {
    const response = await api.get("/tickets/stats/");
    return response.data;
};

export const classifyTicket = async (description) => {
    const response = await api.post("/tickets/classify/", { description });
    return response.data;
};

export default api;
