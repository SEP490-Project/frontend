import api from "../api";
import type {
  CreateVariantAttributePayload,
  GetVariantAttributesParams,
} from "../types/variant-attribute";

export const manageAttribute = {
  getAllVariantAttributes: (params: GetVariantAttributesParams) =>
    api.get("/variant-attributes", { params }),
  createVariantAttributes: (data: CreateVariantAttributePayload) =>
    api.post("/variant-attributes", data),
};
