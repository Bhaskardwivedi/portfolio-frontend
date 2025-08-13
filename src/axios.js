import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.bhaskarai.com/api",
  timeout: 15000,
});
console.log("DEBUG VITE_API_URL =", import.meta.env.VITE_API_URL);
// Only attach creds/CSRF for unsafe methods
api.interceptors.request.use((config) => {
  const m = (config.method || "get").toLowerCase();
  if (["post","put","patch","delete"].includes(m)) {
    // const token = document.cookie?.match(/csrftoken=([^;]+)/)?.[1];
    // if (token) config.headers["X-CSRFToken"] = token;
    // config.withCredentials = true; // enable only if your CORS allows it
  }
  return config;
});

export default api;
