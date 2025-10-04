import { createSlice } from "@reduxjs/toolkit";
import { contract } from "./thunk";
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
}

const initialState: stateType = {
  loading: false,
  contracts: [],
  pagination: null,
};

export const manageContractSlice = createSlice({
  name: "manageContract",
  initialState,
  reducers: {},
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
      });
  },
});

export const { reducer: manageContractReducer, actions: manageContractActions } =
  manageContractSlice;
