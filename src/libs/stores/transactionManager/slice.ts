import type { TransactionResponse, TransactionData } from "@/libs/types/transaction";
import { createSlice } from "@reduxjs/toolkit";
import { getOrderTransactionsForSaleStaffThunk, getTransactionDetailsThunk } from "./thunk";

const transactionManagerSlice = createSlice({
  name: "transactionManager",
  initialState: {
    transactions: null as TransactionResponse | null,
    transactionDetails: null as TransactionData | null,
    loading: false,
    detailsLoading: false,
    errors: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderTransactionsForSaleStaffThunk.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getOrderTransactionsForSaleStaffThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getOrderTransactionsForSaleStaffThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload as any;
      })
      .addCase(getTransactionDetailsThunk.pending, (state) => {
        state.detailsLoading = true;
        state.errors = null;
      })
      .addCase(getTransactionDetailsThunk.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.transactionDetails = action.payload.data;
      })
      .addCase(getTransactionDetailsThunk.rejected, (state, action) => {
        state.detailsLoading = false;
        state.errors = action.payload as any;
      });
  },
});

export const { reducer: transactionManagerReducer, actions: transactionManagerActions } =
  transactionManagerSlice;
