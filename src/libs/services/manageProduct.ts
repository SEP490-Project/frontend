import api from "../api";
import type {
  CreateProductPayload,
  CreateVariantImagePayload,
  ProductParams,
} from "../types/product";

const manageProduct = {
  getAllProducts: (params: ProductParams) => api.get("products/v2", { params }),
  getProductDetail: (productId: string) => api.get(`products/${productId}`),
  getProductByTaskId: (taskId: string) => api.get(`tasks/${taskId}/products`),
  createStandardProduct: (data: CreateProductPayload) => api.post("products/standard", data),
  createLimitedProduct: (data: CreateProductPayload) => api.post("products/limited", data),
  addConceptToLimitedProduct: (productId: string, conceptId: string) =>
    api.post(`products/limited/${productId}/concept/${conceptId}`),
  createProductVariants: (data: any, productId: string) =>
    api.post(`products/${productId}/variants`, data),
  createVariantsImage: (variant_id: string, payload: CreateVariantImagePayload) =>
    api.post(`products/variants/${variant_id}/images`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default manageProduct;
