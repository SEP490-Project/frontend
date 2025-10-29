import axios, { type AxiosInstance, AxiosError } from "axios";
import { requestInterceptor, successInterceptor } from "./interceptors";
import { getRaw, setRaw, removeItem } from "./local-storage";

// 🔹 Thêm _retry vào AxiosRequestConfig để TypeScript không báo lỗi
declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

// =========================
//   Refresh Queue Logic
// =========================
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// =========================
//   Main API Instance
// =========================
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  responseType: "json",
});

api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(successInterceptor, async (error: AxiosError) => {
  const originalRequest = error.config!;

  // Nếu bị 401 và chưa retry lần nào
  if (error.response?.status === 401 && !originalRequest._retry) {
    // Nếu đang refresh -> xếp request hiện tại vào hàng đợi
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

    // Đánh dấu đã retry
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRaw("refresh_token");
    const oldAccessToken = getRaw("access_token");

    if (!refreshToken || !oldAccessToken) {
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      // =========================
      //   Refresh Instance riêng
      // =========================
      const refreshInstance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        responseType: "json",
        headers: {
          Authorization: `Bearer ${oldAccessToken}`,
        },
      });

      // Gửi refresh token kèm Authorization
      const response = await refreshInstance.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const newAccessToken = response.data?.data?.access_token;
      if (!newAccessToken) throw new Error("Missing new access token");

      // Cập nhật access token mới vào localStorage
      setRaw("access_token", newAccessToken);

      // Giải quyết các request đang chờ
      processQueue(null, newAccessToken);
      isRefreshing = false;

      // Retry lại request ban đầu với token mới
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (err) {
      console.error("🔴 Refresh token failed:", err);

      processQueue(err as AxiosError, null);
      isRefreshing = false;

      // Xóa token và logout (tùy app có thể dispatch Redux logout)
      removeItem("access_token");
      removeItem("refresh_token");
      removeItem("user");

      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
  return Promise.reject(error);
});

export default api;
