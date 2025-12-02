import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageSalesAnalytic } from "@/libs/services/manageAnalytic";
import { AxiosError } from "axios";

export const salesBrands = createAsyncThunk("/brands", async (req: any, { rejectWithValue }) => {
  try {
    const response = await manageSalesAnalytic.getSalesBrands(req);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});

export const salesOrders = createAsyncThunk("/orders", async (req: any, { rejectWithValue }) => {
  try {
    const response = await manageSalesAnalytic.getSalesOrders(req);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});

export const salesPayment = createAsyncThunk("/payments", async (req: any, { rejectWithValue }) => {
  try {
    const response = await manageSalesAnalytic.getSalesPayment(req);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});

export const salesPreOrder = createAsyncThunk(
  "/pre-orders",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageSalesAnalytic.getSalesPreOrder(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const salesProducts = createAsyncThunk(
  "/products",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageSalesAnalytic.getSalesProducts(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const salesRevenue = createAsyncThunk("/revenue", async (req: any, { rejectWithValue }) => {
  try {
    const response = await manageSalesAnalytic.getSalesRevenue(req);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});

export const salesTrend = createAsyncThunk("/trend", async (req: any, { rejectWithValue }) => {
  try {
    const response = await manageSalesAnalytic.getSalesTrends(req);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});

export const salesDashboard = createAsyncThunk(
  "/dashboard",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageSalesAnalytic.getSalesDashboard(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
