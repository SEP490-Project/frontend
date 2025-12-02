import { createSlice } from "@reduxjs/toolkit";
import {
  salesBrands,
  salesDashboard,
  salesOrders,
  salesPayment,
  salesPreOrder,
  salesProducts,
  salesRevenue,
  salesTrend,
} from "./thunk";

interface stateType {
  loadingBrands: boolean;
  loadingOrders: boolean;
  loadingPayments: boolean;
  loadingPreOrders: boolean;
  loadingProducts: boolean;
  loadingRevenue: boolean;
  loadingTrend: boolean;
  loadingDashboard: boolean;
  brands: any;
  orders: any;
  payments: any;
  preOrders: any;
  products: any;
  revenue: any;
  trend: any;
  dashboard: any;
}

const initialState: stateType = {
  loadingBrands: false,
  loadingOrders: false,
  loadingPayments: false,
  loadingPreOrders: false,
  loadingProducts: false,
  loadingRevenue: false,
  loadingTrend: false,
  loadingDashboard: false,
  brands: null,
  orders: null,
  payments: null,
  preOrders: null,
  products: null,
  revenue: null,
  trend: null,
  dashboard: null,
};

export const manageSalesAnalyticSlice = createSlice({
  name: "manageSalesAnalytic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(salesBrands.pending, (state) => {
        state.loadingBrands = true;
      })
      .addCase(salesBrands.fulfilled, (state, action) => {
        state.loadingBrands = false;
        state.brands = action.payload.data;
      })
      .addCase(salesBrands.rejected, (state) => {
        state.loadingBrands = false;
      })

      .addCase(salesOrders.pending, (state) => {
        state.loadingOrders = true;
      })
      .addCase(salesOrders.fulfilled, (state, action) => {
        state.loadingOrders = false;
        state.orders = action.payload.data;
      })
      .addCase(salesOrders.rejected, (state) => {
        state.loadingOrders = false;
      })

      .addCase(salesPayment.pending, (state) => {
        state.loadingPayments = true;
      })
      .addCase(salesPayment.fulfilled, (state, action) => {
        state.loadingPayments = false;
        state.payments = action.payload.data;
      })
      .addCase(salesPayment.rejected, (state) => {
        state.loadingPayments = false;
      })

      .addCase(salesPreOrder.pending, (state) => {
        state.loadingPreOrders = true;
      })
      .addCase(salesPreOrder.fulfilled, (state, action) => {
        state.loadingPreOrders = false;
        state.preOrders = action.payload.data;
      })
      .addCase(salesPreOrder.rejected, (state) => {
        state.loadingPreOrders = false;
      })

      .addCase(salesProducts.pending, (state) => {
        state.loadingProducts = true;
      })
      .addCase(salesProducts.fulfilled, (state, action) => {
        state.loadingProducts = false;
        state.products = action.payload.data;
      })
      .addCase(salesProducts.rejected, (state) => {
        state.loadingProducts = false;
      })

      .addCase(salesRevenue.pending, (state) => {
        state.loadingRevenue = true;
      })
      .addCase(salesRevenue.fulfilled, (state, action) => {
        state.loadingRevenue = false;
        state.revenue = action.payload.data;
      })
      .addCase(salesRevenue.rejected, (state) => {
        state.loadingRevenue = false;
      })

      .addCase(salesTrend.pending, (state) => {
        state.loadingTrend = true;
      })
      .addCase(salesTrend.fulfilled, (state, action) => {
        state.loadingTrend = false;
        state.trend = action.payload.data;
      })
      .addCase(salesTrend.rejected, (state) => {
        state.loadingTrend = false;
      })
      .addCase(salesDashboard.pending, (state) => {
        state.loadingDashboard = true;
      })
      .addCase(salesDashboard.fulfilled, (state, action) => {
        state.loadingDashboard = false;
        state.dashboard = action.payload.data;
      })
      .addCase(salesDashboard.rejected, (state) => {
        state.loadingDashboard = false;
      });
  },
});

export const { reducer: manageSalesAnalyticReducer, actions: manageSalesAnalyticActions } =
  manageSalesAnalyticSlice;
