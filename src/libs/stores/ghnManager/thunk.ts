import { manageGHN } from "@/libs/services/manageGHN";
import type { GHNUpdateOrderStatusRequest } from "@/libs/types/ghn";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

export const getGHNInfoRaw = createAsyncThunk(
  "/ghn/info",
  async (ghnCode: string, { rejectWithValue }) => {
    try {
      // Mock response for GHN order info
      const resp = await manageGHN.getGhnOrderInfo(ghnCode);
      return resp.data;
    } catch (error) {
      console.error("Error fetching GHN order info:", error);
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const updateGHNOrderStatus = createAsyncThunk(
  "/ghn/order/status",
  async (req: GHNUpdateOrderStatusRequest, { rejectWithValue }) => {
    try {
      const response = await manageGHN.updateOrderStatus(req);
      return response.data;
    } catch (error) {
      console.error("Error updating GHN order status:", error);
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
