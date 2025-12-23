import api from "@/libs/api";
import type { GHNUpdateOrderStatusRequest } from "../types/ghn";

export const manageGHN = {
  getGhnOrderInfo: (ghnCode: string) => api.get(`/ghn/info/${ghnCode}`),
  updateOrderStatus: (data: GHNUpdateOrderStatusRequest) => api.post("/ghn/order/status", data),
};
