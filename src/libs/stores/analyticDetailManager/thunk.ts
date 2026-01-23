import { manageAnalyticsDetail } from "@/libs/services/manageAnlyticDetail";
import type {
  SaleAnalyticDetailParams,
  SaleAnalyticDetailResponse,
} from "@/libs/types/sale-analytic-detail";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getAllRefundedOrdersThunk = createAsyncThunk(
  "analyticDetailManager/getAllRefundedOrders",
  async (params: SaleAnalyticDetailParams, thunkAPI) => {
    try {
      const response = await manageAnalyticsDetail.getAllRefundedOrders(params);
      return response.data as SaleAnalyticDetailResponse;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const getLimitedNetRevenueDetailsThunk = createAsyncThunk(
  "analyticDetailManager/getLimitedNetRevenueDetails",
  async (params: SaleAnalyticDetailParams, thunkAPI) => {
    try {
      const response = await manageAnalyticsDetail.getLimitedNetRevenueDetails(params);
      return response.data as SaleAnalyticDetailResponse;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const getLimitedGrossRevenueDetailsThunk = createAsyncThunk(
  "analyticDetailManager/getLimitedGrossRevenueDetails",
  async (params: SaleAnalyticDetailParams, thunkAPI) => {
    try {
      const response = await manageAnalyticsDetail.getLimitedGrossRevenueDetails(params);
      return response.data as SaleAnalyticDetailResponse;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const getStandardProductRevenueDetailsThunk = createAsyncThunk(
  "analyticDetailManager/getStandardProductRevenueDetails",
  async (params: SaleAnalyticDetailParams, thunkAPI) => {
    try {
      const response = await manageAnalyticsDetail.getStandardProductRevenueDetails(params);
      return response.data as SaleAnalyticDetailResponse;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const getTotalRevenueDetailsThunk = createAsyncThunk(
  "analyticDetailManager/getTotalRevenueDetails",
  async (params: SaleAnalyticDetailParams, thunkAPI) => {
    try {
      const response = await manageAnalyticsDetail.getTotalRevenueDetails(params);
      return response.data as SaleAnalyticDetailResponse;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export {
  getAllRefundedOrdersThunk,
  getLimitedNetRevenueDetailsThunk,
  getLimitedGrossRevenueDetailsThunk,
  getStandardProductRevenueDetailsThunk,
  getTotalRevenueDetailsThunk,
};
