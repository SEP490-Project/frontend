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
  approvePreOrder: (preOrderId: string, action: "CONFIRM" | "CANCEL") =>
    api.post(`/preorders/staff/${preOrderId}/approve?action=${action}`),
  receivedSelfPickupPreOrder: (preOrderId: string, file: FormData) =>
    api.post(`/preorders/staff/${preOrderId}/received`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deliveredSelfDeliveryPreOrder: (preOrderId: string, file: FormData) =>
    api.post(`/preorders/staff/self-delivering/${preOrderId}/delivered`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  compensateAPreOrder: (preOrderId: string, file: FormData) =>
    api.post(`/preorders/staff/${preOrderId}/compensation`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  refundAPreOrder: (preOrderId: string, file: FormData) =>
    api.post(`/preorders/staff/refund/${preOrderId}/approve`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default manageOrder;
