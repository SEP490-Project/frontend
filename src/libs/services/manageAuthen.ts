import api from "@/libs/api";
import type { Login, Register } from "@/libs/types/auth";

export const manageAuthen = {
  login: (req: Login) => api.post("/auth/login", req),
  register: (req: Register) => api.post("/auth/signup", req),
  logout: (req: { refresh_token: string }) => api.post("/auth/logout", req),
  refresh: (req: { refresh_token: string }) => api.post("/auth/refresh", req),
};
