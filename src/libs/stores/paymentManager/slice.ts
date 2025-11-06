import { createSlice } from "@reduxjs/toolkit";
import { getContractPaymentsProfile, getContractPaymentById, generatePaymentLink } from "./thunk";
import type {
  ContractPayment,
  ContractPaymentDetail,
  PaymentLinkResponse,
} from "@/libs/types/payment";

interface StateType {
  loading: boolean;
  payments: ContractPayment[];
  paymentProfile: {
    total_payments: number;
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    overdue_amount: number;
    currency: string;
  } | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
  detailLoading: boolean;
  paymentDetail: ContractPaymentDetail | null;
  linkLoading: boolean;
  paymentLink: PaymentLinkResponse | null;
}

const initialState: StateType = {
  loading: false,
  payments: [],
  paymentProfile: null,
  pagination: null,
  detailLoading: false,
  paymentDetail: null,
  linkLoading: false,
  paymentLink: null,
};

export const managePaymentSlice = createSlice({
  name: "managePayment",
  initialState,
  reducers: {
    clearPayments: (state) => {
      state.payments = [];
      state.paymentProfile = null;
      state.pagination = null;
    },
    clearPaymentDetail: (state) => {
      state.paymentDetail = null;
    },
    clearPaymentLink: (state) => {
      state.paymentLink = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get contract payments profile
      .addCase(getContractPaymentsProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContractPaymentsProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const { payments, ...profile } = action.payload.data;
          state.payments = payments || [];
          state.paymentProfile = profile;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getContractPaymentsProfile.rejected, (state) => {
        state.loading = false;
        state.payments = [];
        state.paymentProfile = null;
      })

      // Get contract payment by ID
      .addCase(getContractPaymentById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(getContractPaymentById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.paymentDetail = action.payload.data;
      })
      .addCase(getContractPaymentById.rejected, (state) => {
        state.detailLoading = false;
        state.paymentDetail = null;
      })

      // Generate payment link
      .addCase(generatePaymentLink.pending, (state) => {
        state.linkLoading = true;
      })
      .addCase(generatePaymentLink.fulfilled, (state, action) => {
        state.linkLoading = false;
        state.paymentLink = action.payload.data;
      })
      .addCase(generatePaymentLink.rejected, (state) => {
        state.linkLoading = false;
        state.paymentLink = null;
      });
  },
});

export const { reducer: managePaymentReducer, actions: managePaymentActions } = managePaymentSlice;
