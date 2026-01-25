import manageProduct from "@/libs/services/manageProduct";
import type {
  CreateProductPayload,
  CreateVariantImagePayload,
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

const getAllStandardProductsThunk = createAsyncThunk(
  "products/getAllStandard",
  async (params: ProductParams, { rejectWithValue }) => {
    try {
      const response = await manageProduct.getAllStandardProducts(params);
      return response.data as ProductResponse<ProductData[]>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch standard products");
    }
  },
);

const getAllLimitedProductsThunk = createAsyncThunk(
  "products/getAllLimited",
  async (params: ProductParams, { rejectWithValue }) => {
    try {
      const response = await manageProduct.getAllLimitedProducts(params);
      return response.data as ProductResponse<ProductData[]>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch limited products");
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
      return response.data as ProductResponse<ProductData>;
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
      const formatPayload = {
        ...payload,
        story: {
          content: payload.story || "",
        },
      };
      const response = await manageProduct.createProductVariants(formatPayload, productId);
      return response.data as ProductResponse<ProductData>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to create product variant");
    }
  },
);

const createLimitedProductThunk = createAsyncThunk(
  "products/createLimited",
  async (payload: CreateProductPayload, { rejectWithValue }) => {
    try {
      const response = await manageProduct.createLimitedProduct(payload);
      return response.data as ProductResponse<ProductData>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to create product");
    }
  },
);

const createVariantImageThunk = createAsyncThunk(
  "products/createVariantImage",
  async (
    { variantId, payload }: { variantId: string; payload: CreateVariantImagePayload },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageProduct.createVariantsImage(variantId, payload);
      return response.data as ProductResponse<ProductData>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to upload variant image");
    }
  },
);

const deleteVariantImageThunk = createAsyncThunk(
  "products/deleteVariantImage",
  async (imageId: string, { rejectWithValue }) => {
    try {
      const response = await manageProduct.deleteVariantImage(imageId);
      return response.data;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to delete variant image");
    }
  },
);

const updateProductStateThunk = createAsyncThunk(
  "products/updateState",
  async ({ productId, status }: { productId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await manageProduct.updateProductState(productId, status);
      return response.data;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to update product state");
    }
  },
);

const updateProductVisibilityThunk = createAsyncThunk(
  "products/updateVisibility",
  async (
    { productId, isActive }: { productId: string; isActive: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageProduct.updateProductVisibility(productId, isActive);
      return response.data;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to update product visibility");
    }
  },
);

const updateProductBasicInfoThunk = createAsyncThunk(
  "products/updateBasicInfo",
  async (
    { productId, data }: { productId: string; data: Partial<CreateProductPayload> },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageProduct.updateProductBasicInfo(productId, data);
      return response.data as ProductResponse<ProductData>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to update product info");
    }
  },
);

const updateLimitedProductBasicInfoThunk = createAsyncThunk(
  "products/updateLimitedBasicInfo",
  async (
    { productId, data }: { productId: string; data: Partial<CreateProductPayload> },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageProduct.updateLimitedProductBasicInfo(productId, data);
      return response.data as ProductResponse<ProductData>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to update limited product info",
      );
    }
  },
);

const updateProductVariantThunk = createAsyncThunk(
  "products/updateVariant",
  async (
    { variantId, data }: { variantId: string; data: Partial<ProductVariant> },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageProduct.updateProductVariant(variantId, data);
      return response.data as ProductResponse<ProductData>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to update product variant");
    }
  },
);

const updateLimitedProductVariantThunk = createAsyncThunk(
  "products/updateLimitedVariant",
  async (
    { variantId, data }: { variantId: string; data: Partial<ProductVariant> },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageProduct.updateLimitedProductVariant(variantId, data);
      return response.data as ProductResponse<ProductData>;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to update limited product variant",
      );
    }
  },
);

const openEarlyPreorderProductDeliveryThunk = createAsyncThunk(
  "products/openEarlyPreorderDelivery",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await manageProduct.openEarlyPreorderProductDelivery(productId);
      return response.data;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to open early preorder product delivery",
      );
    }
  },
);

const openEarlyPreorderProductPremiereDateThunk = createAsyncThunk(
  "products/openEarlyPreorderPremiereDate",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await manageProduct.openEarlyPreorderProductPremiereDate(productId);
      return response.data;
    } catch (error: AxiosError | unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to open early preorder product premiere date",
      );
    }
  },
);

export {
  getAllProductsThunk,
  getProductByTaskIdThunk,
  createStandardProductThunk,
  createVariantProductThunk,
  getProductDetailThunk,
  createLimitedProductThunk,
  createVariantImageThunk,
  updateProductStateThunk,
  updateProductVisibilityThunk,
  updateProductBasicInfoThunk,
  updateLimitedProductBasicInfoThunk,
  updateProductVariantThunk,
  updateLimitedProductVariantThunk,
  openEarlyPreorderProductDeliveryThunk,
  openEarlyPreorderProductPremiereDateThunk,
  deleteVariantImageThunk,
  getAllStandardProductsThunk,
  getAllLimitedProductsThunk,
};
