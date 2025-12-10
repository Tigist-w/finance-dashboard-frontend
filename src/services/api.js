import axios from "axios";

const BASE = import.meta.env.VITE_API_URL; // must be set in Vercel

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // Use same axios instance to preserve credentials
        const r = await api.post("/auth/refresh", {});
        const newToken = r.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original); // retry original request
      } catch (e) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;

