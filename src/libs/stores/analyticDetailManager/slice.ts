import { createSlice } from "@reduxjs/toolkit";
import {
  getAllRefundedOrdersThunk,
  getLimitedNetRevenueDetailsThunk,
  getLimitedGrossRevenueDetailsThunk,
  getStandardProductRevenueDetailsThunk,
  getTotalRevenueDetailsThunk,
} from "./thunk";
import type { SaleAnalyticDetailResponse } from "@/libs/types/sale-analytic-detail";

const manageAnalyticsDetail = createSlice({
  name: "analyticDetailManager",
  initialState: {
    refundedOrders: null as SaleAnalyticDetailResponse | null,
    limitedNetRevenueDetails: null as SaleAnalyticDetailResponse | null,
    limitedGrossRevenueDetails: null as SaleAnalyticDetailResponse | null,
    standardProductRevenueDetails: null as SaleAnalyticDetailResponse | null,
    totalRevenueDetails: null as SaleAnalyticDetailResponse | null,
    loading: false,
    error: null as any | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllRefundedOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRefundedOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.refundedOrders = action.payload;
      })
      .addCase(getAllRefundedOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLimitedNetRevenueDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLimitedNetRevenueDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.limitedNetRevenueDetails = action.payload;
      })
      .addCase(getLimitedNetRevenueDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLimitedGrossRevenueDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLimitedGrossRevenueDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.limitedGrossRevenueDetails = action.payload;
      })
      .addCase(getLimitedGrossRevenueDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStandardProductRevenueDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStandardProductRevenueDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.standardProductRevenueDetails = action.payload;
      })
      .addCase(getStandardProductRevenueDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTotalRevenueDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalRevenueDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.totalRevenueDetails = action.payload;
      })
      .addCase(getTotalRevenueDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { reducer: analyticDetailManagerReducers, actions: analyticDetailManagerActions } =
  manageAnalyticsDetail;
