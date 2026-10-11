// src/api/axios.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
        const { token } = JSON.parse(stored) as { token: string };
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authUser");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
