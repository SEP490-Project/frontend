import manageOrder from "@/libs/services/manageOrder";
import type { OrderRequestQuery, OrderResponse } from "@/libs/types/order";
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

export {
  getOrderForSaleStaffThunk,
  markOrderIsReadyToPickedUpThunk,
  markOrderIsReceivedAfterPickedUpThunk,
  censorAnOrderThunk,
  getSelfDeliveryOrdersThunk,
  markSelfDeliveryOrderAsDeliveredThunk,
  markSelfDeliveryOrderAsInTransitThunk,
};
