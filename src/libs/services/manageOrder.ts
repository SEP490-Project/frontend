import api from "../api";
import type { OrderRequestQuery } from "../types/order";

export const manageOrder = {
  getOrderForSaleStaff: (query: OrderRequestQuery) => api.get("/orders/staff", { params: query }),
};

export default manageOrder;
