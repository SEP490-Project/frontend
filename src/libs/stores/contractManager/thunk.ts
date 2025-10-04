import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageContract } from "@/libs/services/manageContract";
import type { ContractParams } from "@/libs/types/contract";

export const getContractsByBrand = createAsyncThunk(
  "contracts/getByBrand",
  async (req: ContractParams, { rejectWithValue }) => {
    try {
      const response = await manageContract.getContractsByBrand(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
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
