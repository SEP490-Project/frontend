import api from "../api";
import type { CreateProductPayload, ProductParams, ProductVariant } from "../types/product";

const manageProduct = {
  getAllProducts: (params: ProductParams) => api.get("products", { params }),
  getProductDetail: (productId: string) => api.get(`products/${productId}`),
  getProductByTaskId: (taskId: string) => api.get(`tasks/${taskId}/products`),
  createStandardProduct: (data: CreateProductPayload) => api.post("products/standard", data),
  createProductVariants: (data: ProductVariant, productId: string) =>
    api.post(`products/${productId}/variants`, data),
  createVariantsImage: (data: any, variantId: string) =>
    api.post(`products/variants/${variantId}/images`, data),
};

export default manageProduct;
