import manageTransaction from "@/libs/services/manageTransaction";
import type { TransactionResponse } from "@/libs/types/transaction";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getOrderTransactionsForSaleStaffThunk = createAsyncThunk(
  "transactionManager/getOrderTransactionsForSaleStaff",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await manageTransaction.getOrderTransactionsForSaleStaff(params);
      return response.data as TransactionResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const getTransactionDetailsThunk = createAsyncThunk(
  "transactionManager/getTransactionDetails",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await manageTransaction.getTransactionById(transactionId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export { getOrderTransactionsForSaleStaffThunk, getTransactionDetailsThunk };
