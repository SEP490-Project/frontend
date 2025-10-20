import manageProduct from "@/libs/services/manageProduct";
import type {
  CreateProductPayload,
  ProductData,
  ProductParams,
  ProductResponse,
  ProductVariant,
} from "@/libs/types/product";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

const getAllProductsThunk = createAsyncThunk(
  "products/getAll",
  async (params: ProductParams, { rejectWithValue }) => {
    try {
      const response = await manageProduct.getAllProducts(params);
      return response.data as ProductResponse<ProductData[]>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
  },
);

const getProductDetailThunk = createAsyncThunk(
  "products/getDetail",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await manageProduct.getProductDetail(productId);
      return response.data as ProductResponse<ProductData>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch product detail");
    }
  },
);

const getProductByTaskIdThunk = createAsyncThunk(
  "products/getByTaskId",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await manageProduct.getProductByTaskId(taskId);
      return response.data as ProductResponse<ProductData[]>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch product");
    }
  },
);

const createStandardProductThunk = createAsyncThunk(
  "products/createStandard",
  async (payload: CreateProductPayload, { rejectWithValue }) => {
    try {
      const response = await manageProduct.createStandardProduct(payload);
      return response.data as ProductData;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to create product");
    }
  },
);

const createVariantProductThunk = createAsyncThunk(
  "products/createVariant",
  async (
    { payload, productId }: { payload: ProductVariant; productId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageProduct.createProductVariants(payload, productId);
      return response.data as ProductResponse<ProductData>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to create product variant");
    }
  },
);

export {
  getAllProductsThunk,
  getProductByTaskIdThunk,
  createStandardProductThunk,
  createVariantProductThunk,
  getProductDetailThunk,
};
