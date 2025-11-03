import { createSlice } from "@reduxjs/toolkit";
import { brand, addBrand, brandDetail, updateBrand } from "./thunk";
import type { Brands } from "@/libs/types/brand";
import { toast } from "sonner";

interface stateType {
  loading: boolean;
  brands: Brands[];
  brand: Brands | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
}

const initialState: stateType = {
  loading: false,
  brands: [],
  brand: null,
  pagination: null,
};

export const manageBrandSlice = createSlice({
  name: "manageBrand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(brand.pending, (state) => {
        state.loading = true;
      })
      .addCase(brand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(brand.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.loading = false;
        const message = action.payload?.message || "Brand created successfully";
        toast.success(message);
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = false;
        const message = (action.payload as string) || "Error creating brand. Please try again.";
        toast.error(message);
      })
      .addCase(brandDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(brandDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.brand = action.payload.data;
      })
      .addCase(brandDetail.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const message = action.payload?.message || "Brand updated successfully";
        toast.success(message);
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        const message = (action.payload as string) || "Failed to update brand.";
        toast.error(message);
      });
  },
});

export const { reducer: manageBrandReducer, actions: manageBrandActions } = manageBrandSlice;
