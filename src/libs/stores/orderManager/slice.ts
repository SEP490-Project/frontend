import { createSlice } from "@reduxjs/toolkit";
import { getOrderForSaleStaffThunk } from "./thunk";
import type { OrderResponse } from "@/libs/types/order";

const orderManagerSlice = createSlice({
  name: "orderManager",
  initialState: {
    ordersForSaleStaff: null as OrderResponse | null,
    loading: false,
    errors: null as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderForSaleStaffThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getOrderForSaleStaffThunk.fulfilled, (state, action) => {
        state.ordersForSaleStaff = action.payload;
        state.loading = false;
      })
      .addCase(getOrderForSaleStaffThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      });
  },
});

export const { reducer: orderManagerReducer, actions: orderManagerActions } = orderManagerSlice;
