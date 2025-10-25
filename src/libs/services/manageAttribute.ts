import api from "../api";
import type { CreateVariantAttributePayload } from "../types/variant-attribute";

export const manageAttribute = {
  getAllVariantAttributes: () => api.get("/variant-attributes"),
  createVariantAttributes: (data: CreateVariantAttributePayload) =>
    api.post("/variant-attributes", data),
};
