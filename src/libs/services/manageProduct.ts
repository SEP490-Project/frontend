import api from "../api";
import type { CreateProductPayload } from "../types/product";

const manageProduct = {
  getAllProducts: (params: { limit: number; offset: number }) => api.get("products", { params }),
  getProductByTaskId: (taskId: string) => api.get(`tasks/${taskId}/products`),
  createStandardProduct: (data: CreateProductPayload) => api.post("products/standard", data),
  createProductVariants: (data: any, productId: string) =>
    api.post(`products/${productId}/variants`, data),
  createVariantsImage: (data: any, variantId: string) =>
    api.post(`products/variants/${variantId}/images`, data),
};

export default manageProduct;
