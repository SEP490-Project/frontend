import axios, { type AxiosInstance } from "axios";
import { requestInterceptor, successInterceptor } from "./interceptors";
import { getRaw, setRaw } from "./local-storage";

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  responseType: "json",
});

api.interceptors.request.use(requestInterceptor);

api.interceptors.response.use(successInterceptor, async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRaw("refresh_token");
    if (!refreshToken) {
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/refresh`,
        { refresh_token: refreshToken },
        { headers: { "Content-Type": "application/json" } },
      );

      const newAccessToken = response.data?.data?.access_token;
      setRaw("access_token", newAccessToken);

      processQueue(null, newAccessToken);
      isRefreshing = false;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      isRefreshing = false;
      return Promise.reject(err);
    }
  }

  return Promise.reject(error);
});

export default api;
