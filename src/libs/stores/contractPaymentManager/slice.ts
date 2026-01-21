import { createSlice } from "@reduxjs/toolkit";
import {
  getContractPayment,
  getContractPaymentBrand,
  getContractPaymentDetail,
  createPaymentLink,
  getRefundPayments,
  getPendingRefundProofs,
  submitRefundProof,
  reviewRefundProof,
} from "./thunk";
import type { ContractPayment, PaymentLink } from "@/libs/types/contract-payments";

interface stateType {
  loading: boolean;
  detailLoading: boolean;
  contractPayments: ContractPayment[];
  contractPaymentBrand: ContractPayment[];
  contractPaymentDetail: ContractPayment | null;
  paymentLink: PaymentLink | null;
  loadingPayment: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
  // Refund workflow state
  refundPayments: ContractPayment[];
  pendingRefundProofs: ContractPayment[];
  refundLoading: boolean;
  refundSubmitting: boolean;
  refundReviewing: boolean;
}

const initialState: stateType = {
  loading: false,
  detailLoading: false,
  contractPayments: [],
  contractPaymentBrand: [],
  contractPaymentDetail: null,
  paymentLink: null,
  loadingPayment: false,
  pagination: null,
  // Refund workflow state
  refundPayments: [],
  pendingRefundProofs: [],
  refundLoading: false,
  refundSubmitting: false,
  refundReviewing: false,
};

export const manageContractPaymentSlice = createSlice({
  name: "manageContractPayment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getContractPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContractPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.contractPayments = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(getContractPayment.rejected, (state) => {
        state.loading = false;
      })

      .addCase(getContractPaymentBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContractPaymentBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.contractPaymentBrand = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(getContractPaymentBrand.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createPaymentLink.pending, (state) => {
        state.loadingPayment = true;
      })
      .addCase(createPaymentLink.fulfilled, (state, action) => {
        state.loadingPayment = false;
        state.paymentLink = action.payload.data || null;
      })
      .addCase(createPaymentLink.rejected, (state) => {
        state.loadingPayment = false;
      })

      .addCase(getContractPaymentDetail.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(getContractPaymentDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.contractPaymentDetail = action.payload.data || null;
      })
      .addCase(getContractPaymentDetail.rejected, (state) => {
        state.detailLoading = false;
      })

      // Refund workflow reducers
      .addCase(getRefundPayments.pending, (state) => {
        state.refundLoading = true;
      })
      .addCase(getRefundPayments.fulfilled, (state, action) => {
        state.refundLoading = false;
        state.refundPayments = action.payload.data || [];
      })
      .addCase(getRefundPayments.rejected, (state) => {
        state.refundLoading = false;
      })

      .addCase(getPendingRefundProofs.pending, (state) => {
        state.refundLoading = true;
      })
      .addCase(getPendingRefundProofs.fulfilled, (state, action) => {
        state.refundLoading = false;
        state.pendingRefundProofs = action.payload.data || [];
      })
      .addCase(getPendingRefundProofs.rejected, (state) => {
        state.refundLoading = false;
      })

      .addCase(submitRefundProof.pending, (state) => {
        state.refundSubmitting = true;
      })
      .addCase(submitRefundProof.fulfilled, (state, action) => {
        state.refundSubmitting = false;
        // Update the payment in refundPayments list
        const updatedPayment = action.payload.data;
        if (updatedPayment) {
          const index = state.refundPayments.findIndex((p) => p.id === updatedPayment.id);
          if (index !== -1) {
            state.refundPayments[index] = updatedPayment;
          }
        }
      })
      .addCase(submitRefundProof.rejected, (state) => {
        state.refundSubmitting = false;
      })

      .addCase(reviewRefundProof.pending, (state) => {
        state.refundReviewing = true;
      })
      .addCase(reviewRefundProof.fulfilled, (state, action) => {
        state.refundReviewing = false;
        // Update the payment in pendingRefundProofs list
        const updatedPayment = action.payload.data;
        if (updatedPayment) {
          const index = state.pendingRefundProofs.findIndex((p) => p.id === updatedPayment.id);
          if (index !== -1) {
            state.pendingRefundProofs[index] = updatedPayment;
          }
        }
      })
      .addCase(reviewRefundProof.rejected, (state) => {
        state.refundReviewing = false;
      });
  },
});

export const { reducer: manageContractPaymentReducer, actions: manageContractPaymentActions } =
  manageContractPaymentSlice;
