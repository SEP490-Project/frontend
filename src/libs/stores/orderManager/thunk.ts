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

export { getOrderForSaleStaffThunk };
