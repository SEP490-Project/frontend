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
  updateProductState: (productId: string, status: string) =>
    api.patch(`products/${productId}/state`, { state: status }),
  updateProductVisibility: (productId: string, isActive: boolean) =>
    api.patch(`products/publish/${productId}/${isActive}`),
};

export default manageProduct;
