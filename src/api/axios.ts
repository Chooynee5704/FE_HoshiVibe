import axios from 'axios';

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "")) ||
  "https://hoshi-vibe-site.somee.com/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hv_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401) {
//       localStorage.removeItem("hv_token");
//       localStorage.removeItem("hv_user");
//       // Chuyển về trang login (tuỳ route app)
//       if (typeof window !== "undefined") window.location.replace("/login");
//     }
//     return Promise.reject(err);
//   }
// );