// Centralized API configuration for EduPlace-Hub
// Automatically switches between local dev and live Render backend based on environment

export const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Local development check
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5001/api";
    }
  }
  
  // Production fallback: live backend on Render
  return "https://eduplace-hub.onrender.com/api";
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
