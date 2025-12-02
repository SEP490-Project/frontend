import { createSlice } from "@reduxjs/toolkit";
import {
  getOrderForSaleStaffThunk,
  censorAnOrderThunk,
  markOrderIsReadyToPickedUpThunk,
  markOrderIsReceivedAfterPickedUpThunk,
  getSelfDeliveryOrdersThunk,
  markSelfDeliveryOrderAsDeliveredThunk,
  markSelfDeliveryOrderAsInTransitThunk,
  approvePreOrderThunk,
  getPreOrdersForSaleStaffThunk,
  approveRefundAnOrderThunk,
  compensateAnOrderThunk,
  compensateAPreOrderThunk,
  refundAPreOrderThunk,
  deliveredSelfDeliveryPreOrderThunk,
  receivedSelfPickupPreOrderThunk,
} from "./thunk";
import type { OrderResponse } from "@/libs/types/order";
import type { PreOrderResponse } from "@/libs/types/pre-order";

const orderManagerSlice = createSlice({
  name: "orderManager",
  initialState: {
    ordersForSaleStaff: null as OrderResponse | null,
    preOrderForSaleStaff: null as PreOrderResponse | null,
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
      })
      .addCase(getSelfDeliveryOrdersThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getSelfDeliveryOrdersThunk.fulfilled, (state, action) => {
        state.ordersForSaleStaff = action.payload;
        state.loading = false;
      })
      .addCase(getSelfDeliveryOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(markSelfDeliveryOrderAsDeliveredThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(markSelfDeliveryOrderAsDeliveredThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markSelfDeliveryOrderAsDeliveredThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(markSelfDeliveryOrderAsInTransitThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(markSelfDeliveryOrderAsInTransitThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markSelfDeliveryOrderAsInTransitThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(getPreOrdersForSaleStaffThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getPreOrdersForSaleStaffThunk.fulfilled, (state, action) => {
        state.preOrderForSaleStaff = action.payload;
        state.loading = false;
      })
      .addCase(getPreOrdersForSaleStaffThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(approvePreOrderThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(approvePreOrderThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(approvePreOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(approveRefundAnOrderThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(approveRefundAnOrderThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(approveRefundAnOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(compensateAnOrderThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(compensateAnOrderThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(compensateAnOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(compensateAPreOrderThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(compensateAPreOrderThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(compensateAPreOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(refundAPreOrderThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(refundAPreOrderThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(refundAPreOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(receivedSelfPickupPreOrderThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(receivedSelfPickupPreOrderThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(receivedSelfPickupPreOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      })
      .addCase(deliveredSelfDeliveryPreOrderThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(deliveredSelfDeliveryPreOrderThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deliveredSelfDeliveryPreOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error;
      });
  },
});

export const { reducer: orderManagerReducer, actions: orderManagerActions } = orderManagerSlice;
