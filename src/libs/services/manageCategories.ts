import api from "../api";
import type { createCategoryPayload, ProductCategoryParams } from "../types/category";

const manageCategories = {
  getAllCategories: (params?: ProductCategoryParams) => api.get("categories", { params }),
  createCategory: (data: createCategoryPayload) => api.post("categories", data),
  deleteCategory: (categoryId: string) => api.delete(`categories/${categoryId}`),
  assignParentCategory: (categoryId: string, parentCategoryId: string) =>
    api.patch(`categories/${categoryId}/parent?parent_id=${parentCategoryId}`),
};

export default manageCategories;
