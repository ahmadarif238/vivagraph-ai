// Configuration for API URL
// Vercel will inject VITE_API_URL at build time
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
console.log("Using API Base URL:", API_BASE_URL);
