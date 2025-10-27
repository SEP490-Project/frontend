import { createSlice } from "@reduxjs/toolkit";
import { getAllVariantAttributesForAdminThunk, getAllVariantAttributesThunk } from "./thunk";
import type { VariantAttributeResponse } from "@/libs/types/variant-attribute";

const attributeManagerSlice = createSlice({
  name: "attributeManager",
  initialState: {
    attributes: null as VariantAttributeResponse | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllVariantAttributesForAdminThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllVariantAttributesForAdminThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.attributes = action.payload;
    });
    builder.addCase(getAllVariantAttributesForAdminThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | null;
    });
    builder.addCase(getAllVariantAttributesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllVariantAttributesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.attributes = action.payload;
    });
    builder.addCase(getAllVariantAttributesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | null;
    });
  },
});

export const { reducer: attributeManagerReducer, actions: attributeManagerActions } =
  attributeManagerSlice;
