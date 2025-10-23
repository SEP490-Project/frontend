import manageCategories from "@/libs/services/manageCategories";
import type { CategoryResponse, ProductCategoryParams } from "@/libs/types/category";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getAllCategoriesThunk = createAsyncThunk(
  "categories/getAll",
  async (params: ProductCategoryParams | undefined, { rejectWithValue }) => {
    try {
      const response = await manageCategories.getAllCategories(params);
      return response.data as CategoryResponse;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Failed to fetch categories",
      );
    }
  },
);

const createCategoryThunk = createAsyncThunk(
  "categories/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await manageCategories.createCategory(data);
      return response.data as CategoryResponse;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || "Failed to create category");
    }
  },
);

const deleteCategoryThunk = createAsyncThunk(
  "categories/delete",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await manageCategories.deleteCategory(categoryId);
      return response.data as CategoryResponse;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || "Failed to delete category");
    }
  },
);

const assignParentCategoryThunk = createAsyncThunk(
  "categories/assignParent",
  async (
    { categoryId, parentCategoryId }: { categoryId: string; parentCategoryId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageCategories.assignParentCategory(categoryId, parentCategoryId);
      return response.data as CategoryResponse;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Failed to assign parent category",
      );
    }
  },
);

export {
  getAllCategoriesThunk,
  createCategoryThunk,
  deleteCategoryThunk,
  assignParentCategoryThunk,
};
