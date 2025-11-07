import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { managePayment } from "@/libs/services/managePayment";
import type { PaymentProfileParams, PaymentLinkRequest } from "@/libs/types/payment";

export const getContractPaymentsProfile = createAsyncThunk(
  "payments/getProfile",
  async (params: PaymentProfileParams = {}, { rejectWithValue }) => {
    try {
      const response = await managePayment.getContractPaymentsProfile(params);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch payment profile");
    }
  },
);

export const getContractPaymentById = createAsyncThunk(
  "payments/getById",
  async (contractPaymentId: string, { rejectWithValue }) => {
    try {
      const response = await managePayment.getContractPaymentById(contractPaymentId);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch payment detail");
    }
  },
);

export const generatePaymentLink = createAsyncThunk(
  "payments/generateLink",
  async (
    { contractPaymentId, request }: { contractPaymentId: string; request: PaymentLinkRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await managePayment.generatePaymentLink(contractPaymentId, request);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to generate payment link");
    }
  },
);
