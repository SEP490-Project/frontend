import { createSlice } from "@reduxjs/toolkit";
import {
  salesFinancialsDashboard,
  salesRevenueGrowth,
  salesRevenueTrend,
  salesOrderDashboard,
  salesOrderTrend,
} from "./thunk";

interface stateType {
  loadingFinancialsDashboard: boolean;
  loadingRevenueGrowth: boolean;
  loadingRevenueTrend: boolean;
  loadingOrderDashboard: boolean;
  loadingOrderTrend: boolean;
  financialsDashboard: any;
  revenueGrowth: any;
  revenueTrend: any;
  orderDashboard: any;
  orderTrend: any;
}

const initialState: stateType = {
  loadingFinancialsDashboard: false,
  loadingRevenueGrowth: false,
  loadingRevenueTrend: false,
  loadingOrderDashboard: false,
  loadingOrderTrend: false,
  financialsDashboard: null,
  revenueGrowth: null,
  revenueTrend: null,
  orderDashboard: null,
  orderTrend: null,
};

export const manageSalesAnalyticSlice = createSlice({
  name: "manageSalesAnalytic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(salesFinancialsDashboard.pending, (state) => {
        state.loadingFinancialsDashboard = true;
      })
      .addCase(salesFinancialsDashboard.fulfilled, (state, action) => {
        state.loadingFinancialsDashboard = false;
        state.financialsDashboard = action.payload.data;
      })
      .addCase(salesFinancialsDashboard.rejected, (state) => {
        state.loadingFinancialsDashboard = false;
      })
      .addCase(salesRevenueGrowth.pending, (state) => {
        state.loadingRevenueGrowth = true;
      })
      .addCase(salesRevenueGrowth.fulfilled, (state, action) => {
        state.loadingRevenueGrowth = false;
        state.revenueGrowth = action.payload.data;
      })
      .addCase(salesRevenueGrowth.rejected, (state) => {
        state.loadingRevenueGrowth = false;
      })
      .addCase(salesRevenueTrend.pending, (state) => {
        state.loadingRevenueTrend = true;
      })
      .addCase(salesRevenueTrend.fulfilled, (state, action) => {
        state.loadingRevenueTrend = false;
        state.revenueTrend = action.payload.data;
      })
      .addCase(salesRevenueTrend.rejected, (state) => {
        state.loadingRevenueTrend = false;
      })
      .addCase(salesOrderDashboard.pending, (state) => {
        state.loadingOrderDashboard = true;
      })
      .addCase(salesOrderDashboard.fulfilled, (state, action) => {
        state.loadingOrderDashboard = false;
        state.orderDashboard = action.payload.data;
      })
      .addCase(salesOrderDashboard.rejected, (state) => {
        state.loadingOrderDashboard = false;
      })
      .addCase(salesOrderTrend.pending, (state) => {
        state.loadingOrderTrend = true;
      })
      .addCase(salesOrderTrend.fulfilled, (state, action) => {
        state.loadingOrderTrend = false;
        state.orderTrend = action.payload.data;
      })
      .addCase(salesOrderTrend.rejected, (state) => {
        state.loadingOrderTrend = false;
      });
  },
});

export const { reducer: manageSalesAnalyticReducer, actions: manageSalesAnalyticActions } =
  manageSalesAnalyticSlice;
