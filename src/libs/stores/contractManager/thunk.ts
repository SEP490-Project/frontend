import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageContract } from "@/libs/services/manageContract";
import type { ContractParams } from "@/libs/types/contract";

export const contract = createAsyncThunk(
  "/contracts",
  async (
    req: {
      brand_id?: string;
      type?: string;
      status?: string;
      keyword?: string;
      no_campaign?: boolean;
      start_date?: string;
      end_date?: string;
      page: number;
      limit: number;
      sort_by: string;
      sort_order: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageContract.brand(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const getContractsByBrand = createAsyncThunk(
  "contracts/getByBrand",
  async (
    req: {
      page: number;
      limit: number;
      sort_by: string;
      sort_order: string;
      type?: string;
      status?: string;
      keyword?: string;
      start_date?: string;
      end_date?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageContract.getContractsByBrand(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch contracts");
    }
  },
);

export const getContractsByBrandId = createAsyncThunk(
  "contracts/getByBrandId",
  async (req: ContractParams, { rejectWithValue }) => {
    try {
      if (!req.brand_id) throw new Error("Missing brand_id");

      const response = await manageContract.getContractsByBrandId(req.brand_id, {
        page: req.page ?? 1,
        limit: req.limit ?? 10,
      });

      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch contracts");
    }
  },
);

export const approveContract = createAsyncThunk(
  "contracts/approve",
  async (contractId: string, { rejectWithValue }) => {
    try {
      const response = await manageContract.approveContract(contractId);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to approve contract");
    }
  },
);

export const rejectContract = createAsyncThunk(
  "contracts/reject",
  async (contractId: string, { rejectWithValue }) => {
    try {
      const response = await manageContract.rejectContract(contractId);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to reject contract");
    }
  },
);

export const getContractById = createAsyncThunk(
  "contracts/getById",
  async (contractId: string, { rejectWithValue }) => {
    try {
      const response = await manageContract.getContractById(contractId);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch contract detail");
    }
  },
);

export const createContract = createAsyncThunk(
  "/contracts/create",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageContract.createContract(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
