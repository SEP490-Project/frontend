import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageContractPayment } from "@/libs/services/manageContractPayment";

export const getContractPayment = createAsyncThunk(
  "/contract_payments",
  async (
    req: {
      brand_id?: string;
      contract_id?: string;
      status?: string;
      due_date_from?: string;
      due_date_to?: string;
      payment_method?: string;
      page: number;
      limit: number;
      sort_by?: string;
      sort_order?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageContractPayment.getContractPayment(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const getContractPaymentBrand = createAsyncThunk(
  "/contract_payments/brand",
  async (
    req: {
      brand_id?: string;
      contract_id?: string;
      status?: string;
      due_date_from?: string;
      due_date_to?: string;
      payment_method?: string;
      page: number;
      limit: number;
      sort_by?: string;
      sort_order?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageContractPayment.getContractPaymentBrand(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const getContractPaymentDetail = createAsyncThunk(
  "/contract_payments/id",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageContractPayment.getContractPaymentDetail(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
