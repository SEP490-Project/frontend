import api from "@/libs/api";
import type { Register } from "@/libs/types/auth";

export const manageAuthen = {
  login: (req: any) => api.post("/auth/login", req),
  register: (req: Register) => api.post("/auth/register-company", req),
};
