import type { ProductData, ProductResponse, ProductVariant } from "@/libs/types/product";
import { createSlice } from "@reduxjs/toolkit";
import {
  createLimitedProductThunk,
  createStandardProductThunk,
  createVariantProductThunk,
  getAllProductsThunk,
  getProductByTaskIdThunk,
  getProductDetailThunk,
} from "./thunk";
import { setItem } from "@/libs/local-storage";

const productManagerSlice = createSlice({
  name: "productManager",
  initialState: {
    products: null as ProductResponse<ProductData[]> | null,
    createdProduct: null as ProductData | null,
    productDetail: null as ProductResponse<ProductData> | null,
    productVariants: [] as ProductVariant[],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(getAllProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(getProductDetailThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStandardProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductDetailThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetail = action.payload;
        state.error = null;
      })
      .addCase(getProductDetailThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch product detail";
      })
      .addCase(createStandardProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdProduct = action.payload;
        setItem("currentProduct", action.payload);
        state.error = null;
      })
      .addCase(createStandardProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create product";
      })
      .addCase(createLimitedProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLimitedProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdProduct = action.payload;
        setItem("currentProduct", action.payload);
        state.error = null;
      })
      .addCase(createLimitedProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create product";
      })
      .addCase(getProductByTaskIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(getProductByTaskIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductByTaskIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch product";
      })
      .addCase(createVariantProductThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVariantProductThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetail = action.payload;
        state.error = null;
      })
      .addCase(createVariantProductThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create product variant";
      });
  },
});

export const { actions: productManagerActions, reducer: productManagerReducer } =
  productManagerSlice;
