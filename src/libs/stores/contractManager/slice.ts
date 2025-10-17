import { createSlice } from "@reduxjs/toolkit";
import { contract } from "./thunk";
import {
  getContractsByBrand,
  approveContract,
  rejectContract,
  getContractById,
  createContract,
} from "./thunk";
import type { ContractDetail } from "@/libs/types/contract";
import type { ContractBase } from "@/libs/types/contract";

interface stateType {
  loading: boolean;
  contracts: ContractBase[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
  actionLoading: boolean; // For approve/reject actions
  detailLoading: boolean;
  contractDetail: ContractDetail | null;
}

const initialState: stateType = {
  loading: false,
  contracts: [],
  pagination: null,
  actionLoading: false,
  detailLoading: false,
  contractDetail: null,
};

export const manageContractSlice = createSlice({
  name: "manageContract",
  initialState,
  reducers: {
    clearContracts: (state) => {
      state.contracts = [];
      state.pagination = null;
    },
    clearContractDetail: (state) => {
      state.contractDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(contract.pending, (state) => {
        state.loading = true;
      })
      .addCase(contract.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload.data;
        console.log("Payload:", action.payload.data);
        state.pagination = action.payload.pagination;
      })
      .addCase(contract.rejected, (state) => {
        state.loading = false;
      })
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
        // Also update contract detail if it's the same contract
        if (state.contractDetail && state.contractDetail.id === action.meta.arg) {
          state.contractDetail.status = "ACTIVE";
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
        // Also update contract detail if it's the same contract
        if (state.contractDetail && state.contractDetail.id === action.meta.arg) {
          state.contractDetail.status = "TERMINATED";
        }
      })
      .addCase(rejectContract.rejected, (state) => {
        state.actionLoading = false;
      })

      // Get contract by ID
      .addCase(getContractById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(getContractById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.contractDetail = action.payload.data;
      })
      .addCase(getContractById.rejected, (state) => {
        state.detailLoading = false;
      })

      .addCase(createContract.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(createContract.fulfilled, (state) => {
        state.detailLoading = false;
      })
      .addCase(createContract.rejected, (state) => {
        state.detailLoading = false;
      });
  },
});

export const { reducer: manageContractReducer, actions: manageContractActions } =
  manageContractSlice;
