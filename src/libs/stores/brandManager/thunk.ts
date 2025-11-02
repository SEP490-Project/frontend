import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageBrand } from "@/libs/services/manageBrand";
import type { AddBrand } from "@/libs/types/brand";

export const brand = createAsyncThunk(
  "/brands",
  async (
    req: { page: number; limit: number; keywords?: string; status?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageBrand.brand(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const addBrand = createAsyncThunk(
  "/brands/add",
  async (req: AddBrand, { rejectWithValue }) => {
    try {
      const response = await manageBrand.addBrand(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const brandDetail = createAsyncThunk(
  "/brands/id",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageBrand.brandDetail(id);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const updateBrand = createAsyncThunk(
  "/brands/update",
  async (req: { id: string; data: AddBrand }, { rejectWithValue }) => {
    try {
      const response = await manageBrand.updateBrand(req.id, req.data);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
