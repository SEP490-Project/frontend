import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageContractPayment } from "@/libs/services/manageContractPayment";
import type {
  CreatePaymentParams,
  SubmitRefundProofRequest,
  ReviewRefundProofRequest,
} from "@/libs/types/contract-payments";

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
      return rejectWithValue(err.response?.data?.message || "Failed");
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
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const createPaymentLink = createAsyncThunk(
  "/contract_payments/payment_link",
  async (req: CreatePaymentParams, { rejectWithValue }) => {
    try {
      const response = await manageContractPayment.createPaymentLink(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
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
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

// CO_PRODUCING Refund Workflow Thunks
export const getRefundPayments = createAsyncThunk(
  "/contract_payments/refunds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageContractPayment.getRefundPayments();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to get refund payments");
    }
  },
);

export const getPendingRefundProofs = createAsyncThunk(
  "/contract_payments/refunds/pending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageContractPayment.getPendingRefundProofs();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to get pending refund proofs");
    }
  },
);

export const submitRefundProof = createAsyncThunk(
  "/contract_payments/refund-proof/submit",
  async (
    req: { contractPaymentId: string; data: SubmitRefundProofRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageContractPayment.submitRefundProof(
        req.contractPaymentId,
        req.data,
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to submit refund proof");
    }
  },
);

export const reviewRefundProof = createAsyncThunk(
  "/contract_payments/refund-proof/review",
  async (
    req: { contractPaymentId: string; data: ReviewRefundProofRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageContractPayment.reviewRefundProof(
        req.contractPaymentId,
        req.data,
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to review refund proof");
    }
  },
);
