import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout for OCR/AI calls
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle "Connection Refused" or "Network Error" (Backend Offline)
    if (!error.response && (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED" || error.message.includes("Network Error"))) {
      const { url, method } = error.config;
      console.warn(`🌐 Backend offline: ${method.toUpperCase()} ${url} - Returning mock data.`);

      // Mock data for common endpoints to keep the UI functional
      if (url.includes("/health/resume")) {
        return {
          data: {
            user: { name: "Rajesh Kumar", age: "63", gender: "Male", diseases: ["Type 2 Diabetes"] },
            vitals: { heartRate: 72, bloodPressure: "120/80", oxygen: 98 }
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config
        };
      }

      if (url.includes("/emergency/qr/generate")) {
        return {
          data: {
            publicUrl: "https://medsafe-pro.ai/profile/sarah-miller-90823",
            qrCodeDataUrl: "" // Will trigger canvas fallback
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config
        };
      }

      if (url.includes("/auth/me")) {
        return {
          data: { user: { name: "Sarah Miller", email: "sarah@example.com", role: "patient" } },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config
        };
      }
    }

    const message = error.response?.data?.message || error.message || "Something went wrong";
    
    // Don't show toast for 401 on login page (handled separately)
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname === "/login";
      if (!isLoginPage) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        toast.error("Session expired. Please login again.");
      }
    } else if (error.response?.status === 500) {
      toast.error("Server error. Please try again later.");
    } else if (!error.config?.silent) {
      // Only show toast if not silent mode
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;