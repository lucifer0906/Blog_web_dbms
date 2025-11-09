import axios from "axios";

// Use environment variable set at build time on Vercel / local .env
const baseURL = process.env.REACT_APP_API_BASE_URL || ""; // empty falls back to relative (proxy in dev)

const api = axios.create({
  baseURL,
});

// Optional: attach auth token later if you implement tokens
// api.interceptors.request.use((config) => { /* modify config */ return config; });

export default api;
