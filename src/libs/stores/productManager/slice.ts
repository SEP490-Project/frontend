import type { ProductData, ProductResponse, ProductVariant } from "@/libs/types/product";
import { createSlice } from "@reduxjs/toolkit";
import {
  createLimitedProductThunk,
  createStandardProductThunk,
  createVariantProductThunk,
  getAllProductsThunk,
  getProductByTaskIdThunk,
  getProductDetailThunk,
  updateProductStateThunk,
  updateProductVisibilityThunk,
  updateProductBasicInfoThunk,
  updateLimitedProductBasicInfoThunk,
  updateProductVariantThunk,
  updateLimitedProductVariantThunk,
  openEarlyPreorderProductDeliveryThunk,
  deleteVariantImageThunk,
  createVariantImageThunk,
  getAllStandardProductsThunk,
  getAllLimitedProductsThunk,
} from "./thunk";
import { setItem } from "@/libs/local-storage";
import { toast } from "sonner";

const productManagerSlice = createSlice({
  name: "productManager",
  initialState: {
    products: null as ProductResponse<ProductData[]> | null,
    standardProducts: null as ProductResponse<ProductData[]> | null,
    limitedProducts: null as ProductResponse<ProductData[]> | null,
    createdProduct: null as ProductResponse<ProductData> | null,
    productDetail: null as ProductResponse<ProductData> | null,
    productVariants: [] as ProductVariant[],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {
    clearProductDetail: (state) => {
      state.productDetail = null;
      state.createdProduct = null;
    },
  },
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
        setItem("currentProduct", action.payload.data);
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
      })

      .addCase(updateProductStateThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductStateThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        toast.success("Product state updated successfully");
      })
      .addCase(updateProductStateThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update product state";
        toast.error(state.error);
      })
      .addCase(updateProductVisibilityThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductVisibilityThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        toast.success("Product visibility updated successfully");
      })
      .addCase(updateProductVisibilityThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update product visibility";
        toast.error(state.error);
      })
      .addCase(updateProductBasicInfoThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductBasicInfoThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetail = action.payload;
        state.error = null;
        toast.success("Product information updated successfully");
      })
      .addCase(updateProductBasicInfoThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update product information";
        toast.error(state.error);
      })
      .addCase(updateLimitedProductBasicInfoThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLimitedProductBasicInfoThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetail = action.payload;
        state.error = null;
        toast.success("Limited product information updated successfully");
      })
      .addCase(updateLimitedProductBasicInfoThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update limited product information";
        toast.error(state.error);
      })
      .addCase(updateProductVariantThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductVariantThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetail = action.payload;
        state.error = null;
        toast.success("Product variant updated successfully");
      })
      .addCase(updateProductVariantThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update product variant";
        toast.error(state.error);
      })
      .addCase(updateLimitedProductVariantThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLimitedProductVariantThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetail = action.payload;
        state.error = null;
        toast.success("Limited product variant updated successfully");
      })
      .addCase(updateLimitedProductVariantThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update limited product variant";
        toast.error(state.error);
      })
      .addCase(openEarlyPreorderProductDeliveryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(openEarlyPreorderProductDeliveryThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        toast.success("Early preorder product delivery opened successfully");
      })
      .addCase(openEarlyPreorderProductDeliveryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to open early preorder product delivery";
        toast.error(state.error);
      })
      .addCase(deleteVariantImageThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVariantImageThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        toast.success("Variant image deleted successfully");
      })
      .addCase(deleteVariantImageThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete variant image";
        toast.error(state.error);
      })
      .addCase(createVariantImageThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVariantImageThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        toast.success("Variant image uploaded successfully");
      })
      .addCase(createVariantImageThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to upload variant image";
        toast.error(state.error);
      })
      .addCase(getAllStandardProductsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllStandardProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.standardProducts = action.payload;
        state.error = null;
      })
      .addCase(getAllStandardProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch standard products";
      })
      .addCase(getAllLimitedProductsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllLimitedProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.limitedProducts = action.payload;
        state.error = null;
      })
      .addCase(getAllLimitedProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch limited products";
      });
  },
});

export const { clearProductDetail } = productManagerSlice.actions;
export const { actions: productManagerActions, reducer: productManagerReducer } =
  productManagerSlice;
