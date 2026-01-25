import api from "../api";
import type {
  CreateProductOptionPayload,
  UpdateProductOptionPayload,
  ProductOptionFilterParams,
  ProductOptionType,
} from "../types/productOption";

const manageProductOptions = {
  // Get all product options with optional filters
  getAll: (params?: ProductOptionFilterParams) => api.get("product-options", { params }),

  // Get product options by type
  getByType: (type: ProductOptionType, activeOnly?: boolean) =>
    api.get(`product-options/type/${type}`, { params: { active_only: activeOnly } }),

  // Get a single product option by ID
  getById: (id: string) => api.get(`product-options/${id}`),

  // Create a new product option (Admin only)
  create: (data: CreateProductOptionPayload) => api.post("product-options", data),

  // Update an existing product option (Admin only)
  update: (id: string, data: UpdateProductOptionPayload) =>
    api.patch(`product-options/${id}`, data),

  // Delete a product option (Admin only)
  delete: (id: string) => api.delete(`product-options/${id}`),
};

export default manageProductOptions;
