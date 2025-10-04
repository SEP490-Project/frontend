import { createSlice } from "@reduxjs/toolkit";
import { getContractsByBrand, approveContract, rejectContract } from "./thunk";
import type { Contract } from "@/libs/types/contract";

interface StateType {
  loading: boolean;
  contracts: Contract[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
  actionLoading: boolean; // For approve/reject actions
}

const initialState: StateType = {
  loading: false,
  contracts: [],
  pagination: null,
  actionLoading: false,
};

export const manageContractSlice = createSlice({
  name: "manageContract",
  initialState,
  reducers: {
    clearContracts: (state) => {
      state.contracts = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get contracts by brand
      .addCase(getContractsByBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContractsByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getContractsByBrand.rejected, (state) => {
        state.loading = false;
      })

      // Approve contract
      .addCase(approveContract.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(approveContract.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update the contract status in the local state
        const contractIndex = state.contracts.findIndex(
          (contract) => contract.id === action.meta.arg,
        );
        if (contractIndex !== -1) {
          state.contracts[contractIndex].status = "ACTIVE";
        }
      })
      .addCase(approveContract.rejected, (state) => {
        state.actionLoading = false;
      })

      // Reject contract
      .addCase(rejectContract.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(rejectContract.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update the contract status in the local state
        const contractIndex = state.contracts.findIndex(
          (contract) => contract.id === action.meta.arg,
        );
        if (contractIndex !== -1) {
          state.contracts[contractIndex].status = "TERMINATED";
        }
      })
      .addCase(rejectContract.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export const { reducer: manageContractReducer, actions: manageContractActions } =
  manageContractSlice;
