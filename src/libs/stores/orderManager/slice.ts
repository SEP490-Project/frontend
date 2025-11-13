import { createSlice } from "@reduxjs/toolkit";
import {
  getOrderForSaleStaffThunk,
  censorAnOrderThunk,
  markOrderIsReadyToPickedUpThunk,
  markOrderIsReceivedAfterPickedUpThunk,
} from "./thunk";
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
      })
      .addCase(markOrderIsReadyToPickedUpThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(markOrderIsReadyToPickedUpThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markOrderIsReadyToPickedUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(markOrderIsReceivedAfterPickedUpThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(markOrderIsReceivedAfterPickedUpThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markOrderIsReceivedAfterPickedUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(censorAnOrderThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(censorAnOrderThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(censorAnOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      });
  },
});

export const { reducer: orderManagerReducer, actions: orderManagerActions } = orderManagerSlice;
