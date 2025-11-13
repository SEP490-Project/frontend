import api from "../api";
import type { OrderRequestQuery } from "../types/order";

export const manageOrder = {
  getOrderForSaleStaff: (query: OrderRequestQuery) => api.get("/orders/staff", { params: query }),
  markOrderIsReadyToPickedUp: (orderId: string) =>
    api.patch(`/orders/staff/readyToPickedUp/${orderId}`),
  markOrderIsReceivedAfterPickedUp: ({ orderId, files }: { orderId: string; files: FormData }) =>
    api.patch(`/orders/staff/receivedAfterPickup/${orderId}`, files, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  censorAnOrder: ({
    orderId,
    action,
    reason,
  }: {
    orderId: string;
    action: "CONFIRM" | "CANCEL";
    reason: any;
  }) => api.post(`/orders/staff/${orderId}/censorship?action=${action}`, reason),
};

export default manageOrder;
