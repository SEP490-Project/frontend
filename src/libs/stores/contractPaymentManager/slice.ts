import { createSlice } from "@reduxjs/toolkit";
import {
  getContractPayment,
  getContractPaymentBrand,
  getContractPaymentDetail,
  createPaymentLink,
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
      });
  },
});

export const { reducer: manageContractPaymentReducer, actions: manageContractPaymentActions } =
  manageContractPaymentSlice;
