import api from "../api";

const manageProduct = {
  getAllProducts: () => api.get("products"),
  getProductByTaskId: (taskId: string) => api.get(`tasks/${taskId}/products`),
};

export default manageProduct;
