import axios from "axios";
import { AuthTokenStore } from "../utils/authToken";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = AuthTokenStore.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? "";
      const isPublicAuthEndpoint =
        requestUrl.includes("/api/auth/login") ||
        requestUrl.includes("/api/auth/register");

      if (!isPublicAuthEndpoint) {
        AuthTokenStore.clear();
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.endsWith("/login")
        ) {
          window.location.assign("/Alchemax/login");
        }
      }
    }
    return Promise.reject(error);
  },
);
