import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCategoriesNoParamsThunk,
  getAllCategoriesThunk,
  updateCategoryThunk,
  assignParentCategoryThunk,
  createCategoryThunk,
  deleteCategoryThunk,
} from "./thunk";
import type { CategoryResponse } from "@/libs/types/category";
import type { Pagination } from "@/libs/types/common";

const CategoryManagerSlice = createSlice({
  name: "categoryManager",
  initialState: {
    categories: null as CategoryResponse | null,
    allCategories: null as CategoryResponse | null,
    pagination: null as Pagination | null,
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
      state.pagination = action.payload.pagination;
    });
    builder.addCase(getAllCategoriesThunk.rejected, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(getAllCategoriesNoParamsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllCategoriesNoParamsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.allCategories = action.payload;
      state.pagination = action.payload.pagination;
    });
    builder
      .addCase(getAllCategoriesNoParamsThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategoryThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(assignParentCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignParentCategoryThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignParentCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { reducer: categoryManagerReducer, actions: categoryManagerActions } =
  CategoryManagerSlice;
