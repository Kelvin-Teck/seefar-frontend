import axios from "axios";

// Uses the environment variable VITE_API_URL defined in .env (http://localhost:5000)
// For deployment, simply set VITE_API_URL to your deployed server URL in your hosting environment (e.g. Vercel/Netlify)
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: baseURL,
});

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('auth-storage');
  if (profile) {
    try {
      const { state } = JSON.parse(profile);
      if (state.authData?.token) {
        req.headers.Authorization = `Bearer ${state.authData.token}`;
      }
    } catch (error) {
      console.error("Error parsing auth storage", error);
    }
  }
  return req;
});

export default API;
