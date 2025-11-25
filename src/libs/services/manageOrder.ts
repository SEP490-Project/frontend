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
  getSelfDeliveryOrders: (query: OrderRequestQuery) =>
    api.get("/orders/staff/self-delivering", { params: query }),
  markSelfDeliveryOrderAsDelivered: ({ orderId, files }: { orderId: string; files: FormData }) =>
    api.patch(`/orders/staff/self-delivering/delivered/${orderId}`, files, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  markSelfDeliveryOrderAsInTransit: (orderId: string) =>
    api.patch(`/orders/staff/self-delivering/in-transit/${orderId}`),
  approveRefundAnOrder: (orderId: string, file: FormData) =>
    api.post(`/orders/staff/${orderId}/refund/approve`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  obligateRefundAnOrder: (orderId: string, file: FormData) =>
    api.post(`/orders/staff/${orderId}/refund/obligate`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  compensateAnOrder: (orderId: string, file: FormData) =>
    api.post(`/orders/staff/${orderId}/compensation`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Pre-Order Management
  getPreOrdersForSaleStaff: (query: OrderRequestQuery) =>
    api.get("/preorders/staff", { params: query }),
  censorAPreOrder: (id: string, action: "CONFIRM" | "CANCEL", reason: any) =>
    api.post(`/preorders/staff/${id}/censorship?action=${action}`, reason),
  compensateAPreOrder: (id: string, file: FormData) =>
    api.post(`/preorders/staff/${id}/compensate`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default manageOrder;
