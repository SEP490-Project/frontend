import api from "../api";
import type {
  CreateVariantAttributePayload,
  GetVariantAttributesParams,
} from "../types/variant-attribute";

export const manageAttribute = {
  getAllVariantAttributes: (params: GetVariantAttributesParams) =>
    api.get("/variant-attributes", { params }),
  getAllVariantAttributesForAdmin: (params: GetVariantAttributesParams) =>
    api.get("/variant-attributes/admin", { params }),
  createVariantAttributes: (data: CreateVariantAttributePayload) =>
    api.post("/variant-attributes", data),
};
