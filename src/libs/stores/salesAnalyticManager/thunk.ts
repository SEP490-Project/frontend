import { manageSalesAnalytic } from "@/libs/services/manageAnalytic";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const salesFinancialsDashboard = createAsyncThunk(
  "manageSalesAnalytic/salesFinancialsDashboard",
  async (params: any, thunkAPI) => {
    try {
      const response = await manageSalesAnalytic.getSalesFinancialOverview(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const salesRevenueGrowth = createAsyncThunk(
  "manageSalesAnalytic/salesRevenueGrowth",
  async (params: any, thunkAPI) => {
    try {
      const response = await manageSalesAnalytic.getSalesRevenueGrowth(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const salesRevenueTrend = createAsyncThunk(
  "manageSalesAnalytic/salesRevenueTrend",
  async (params: any, thunkAPI) => {
    try {
      const response = await manageSalesAnalytic.getSalesRevenueTrend(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const salesOrderDashboard = createAsyncThunk(
  "manageSalesAnalytic/salesOrderDashboard",
  async (params: any, thunkAPI) => {
    try {
      const response = await manageSalesAnalytic.getSalesOrderOverview(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const salesOrderTrend = createAsyncThunk(
  "manageSalesAnalytic/salesOrderTrend",
  async (params: any, thunkAPI) => {
    try {
      const response = await manageSalesAnalytic.getSaleOrderTrend(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
