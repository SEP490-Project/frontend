import manageProduct from "@/libs/services/manageProduct";
import type { ProductResponse } from "@/libs/types/product";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

const getAllProductsThunk = createAsyncThunk(
  "products/getAll",
  async (params: { limit: number; offset: number }, { rejectWithValue }) => {
    try {
      const response = await manageProduct.getAllProducts(params);
      return response.data as ProductResponse;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  },
);

const getProductByTaskIdThunk = createAsyncThunk(
  "products/getByTaskId",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await manageProduct.getProductByTaskId(taskId);
      return response.data as ProductResponse;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch product");
    }
  },
);

export { getAllProductsThunk, getProductByTaskIdThunk };
