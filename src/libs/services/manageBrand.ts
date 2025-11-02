import api from "@/libs/api";
import type { AddBrand } from "@/libs/types/brand";

export const manageBrand = {
  brand: (params: { page: number; limit: number; keywords?: string; status?: string }) =>
    api.get("/brands", { params }),
  addBrand: (data: AddBrand) => api.post("/brands/with-users", data),
  brandDetail: (id: string) => api.get(`/brands/${id}`),
  updateBrand: (id: string, data: AddBrand) => api.put(`/brands/${id}`, data),
};
