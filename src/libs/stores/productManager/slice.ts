import type { ProductResponse } from "@/libs/types/product";
import { createSlice } from "@reduxjs/toolkit";
import { getAllProductsThunk, getProductByTaskIdThunk } from "./thunk";

const productManagerSlice = createSlice({
  name: "productManager",
  initialState: {
    products: null as ProductResponse | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProductsThunk.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(getProductByTaskIdThunk.fulfilled, (state, action) => {
      state.products = action.payload;
    });
  },
});

export const { actions: productManagerActions, reducer: productManagerReducer } =
  productManagerSlice;
