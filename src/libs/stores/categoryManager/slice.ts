import { createSlice } from "@reduxjs/toolkit";
import { getAllCategoriesThunk } from "./thunk";
import type { CategoryResponse } from "@/libs/types/category";

const CategoryManagerSlice = createSlice({
  name: "categoryManager",
  initialState: {
    categories: null as CategoryResponse | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCategoriesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllCategoriesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    });
    builder.addCase(getAllCategoriesThunk.rejected, (state) => {
      state.loading = false;
      state.error = null;
    });
  },
});

export const { reducer: categoryManagerReducer, actions: categoryManagerActions } =
  CategoryManagerSlice;
