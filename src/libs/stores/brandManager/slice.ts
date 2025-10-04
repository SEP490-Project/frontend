import { createSlice } from "@reduxjs/toolkit";
import { brand, addBrand } from "./thunk";
import type { Brands } from "@/libs/types/brand";

interface stateType {
  loading: boolean;
  brands: Brands[];
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
      .addCase(addBrand.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addBrand.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageBrandReducer, actions: manageBrandActions } = manageBrandSlice;
