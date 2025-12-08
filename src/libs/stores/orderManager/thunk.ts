import manageOrder from "@/libs/services/manageOrder";
import type { OrderRequestQuery, OrderResponse } from "@/libs/types/order";
import type { PreOrderResponse } from "@/libs/types/pre-order";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getOrderForSaleStaffThunk = createAsyncThunk(
  "orderManager/getOrderForSaleStaff",
  async (query: OrderRequestQuery, { rejectWithValue }) => {
    try {
      const response = await manageOrder.getOrderForSaleStaff(query);
      return response.data as OrderResponse;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const markOrderIsReadyToPickedUpThunk = createAsyncThunk(
  "orderManager/markOrderIsReadyToPickedUp",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await manageOrder.markOrderIsReadyToPickedUp(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const markOrderIsReceivedAfterPickedUpThunk = createAsyncThunk(
  "orderManager/markOrderIsReceivedAfterPickedUp",
  async ({ orderId, files }: { orderId: string; files: FormData }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.markOrderIsReceivedAfterPickedUp({ orderId, files });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const censorAnOrderThunk = createAsyncThunk(
  "orderManager/censorAnOrder",
  async (
    {
      orderId,
      action,
      reason,
    }: {
      orderId: string;
      action: "CONFIRM" | "CANCEL";
      reason: any;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageOrder.censorAnOrder({ orderId, action, reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const getSelfDeliveryOrdersThunk = createAsyncThunk(
  "orderManager/getSelfDeliveryOrders",
  async (query: OrderRequestQuery, { rejectWithValue }) => {
    try {
      const response = await manageOrder.getSelfDeliveryOrders(query);
      return response.data as OrderResponse;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const markSelfDeliveryOrderAsDeliveredThunk = createAsyncThunk(
  "orderManager/markSelfDeliveryOrderAsDelivered",
  async ({ orderId, files }: { orderId: string; files: FormData }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.markSelfDeliveryOrderAsDelivered({ orderId, files });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const markSelfDeliveryOrderAsInTransitThunk = createAsyncThunk(
  "orderManager/markSelfDeliveryOrderAsInTransit",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await manageOrder.markSelfDeliveryOrderAsInTransit(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const obligateRefundAnOrderThunk = createAsyncThunk(
  "orderManager/obligateRefundAnOrder",
  async ({ orderId, file }: { orderId: string; file: FormData }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.obligateRefundAnOrder(orderId, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const getPreOrdersForSaleStaffThunk = createAsyncThunk(
  "orderManager/getPreOrdersForSaleStaff",
  async (query: OrderRequestQuery, { rejectWithValue }) => {
    try {
      const response = await manageOrder.getPreOrdersForSaleStaff(query);
      return response.data as PreOrderResponse;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const approveRefundAnOrderThunk = createAsyncThunk(
  "orderManager/approveRefundAnOrder",
  async ({ orderId, file }: { orderId: string; file: FormData }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.approveRefundAnOrder(orderId, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const compensateAnOrderThunk = createAsyncThunk(
  "orderManager/compensateAnOrder",
  async ({ orderId, file }: { orderId: string; file: FormData }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.compensateAnOrder(orderId, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const approvePreOrderThunk = createAsyncThunk(
  "orderManager/approvePreOrder",
  async (
    {
      id,
    }: {
      id: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageOrder.approvePreOrder(id, "CONFIRM");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const receivedSelfPickupPreOrderThunk = createAsyncThunk(
  "orderManager/receivedSelfPickupPreOrder",
  async ({ id, file }: { id: string; file: FormData }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.receivedSelfPickupPreOrder(id, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const deliveredSelfDeliveryPreOrderThunk = createAsyncThunk(
  "orderManager/deliveredSelfDeliveryPreOrder",
  async ({ id, file }: { id: string; file: FormData }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.deliveredSelfDeliveryPreOrder(id, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const compensateAPreOrderThunk = createAsyncThunk(
  "orderManager/compensateAPreOrder",
  async ({ id, file }: { id: string; file: FormData }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.compensateAPreOrder(id, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const refundAPreOrderThunk = createAsyncThunk(
  "orderManager/refundAPreOrder",
  async ({ id, file }: { id: string; file: FormData }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.refundAPreOrder(id, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const obligateRefundAPreOrderThunk = createAsyncThunk(
  "orderManager/obligateRefundAPreOrder",
  async ({ id, file }: { id: string; file: FormData }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.obligateRefundAPreOrder(id, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const markLimitedOrderAsDeliveredThunk = createAsyncThunk(
  "orderManager/markLimitedOrderAsDelivered",
  async ({ orderId, files }: { orderId: string; files: FormData }, { rejectWithValue }) => {
    try {
      const response = await manageOrder.markLimitedOrderAsDelivered({ orderId, files });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const markLimitedOrderAsInTransitThunk = createAsyncThunk(
  "orderManager/markLimitedOrderAsInTransit",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await manageOrder.markLimitedOrderAsInTransit(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export {
  getOrderForSaleStaffThunk,
  markOrderIsReadyToPickedUpThunk,
  markOrderIsReceivedAfterPickedUpThunk,
  censorAnOrderThunk,
  getSelfDeliveryOrdersThunk,
  markSelfDeliveryOrderAsDeliveredThunk,
  markSelfDeliveryOrderAsInTransitThunk,
  approveRefundAnOrderThunk,
  compensateAnOrderThunk,
  obligateRefundAnOrderThunk,

  // Limited Order Thunks
  markLimitedOrderAsDeliveredThunk,
  markLimitedOrderAsInTransitThunk,

  // Pre-Order Thunks
  getPreOrdersForSaleStaffThunk,
  approvePreOrderThunk,
  receivedSelfPickupPreOrderThunk,
  deliveredSelfDeliveryPreOrderThunk,
  refundAPreOrderThunk,
  compensateAPreOrderThunk,
  obligateRefundAPreOrderThunk,
};
