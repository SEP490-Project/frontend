import { createSlice } from "@reduxjs/toolkit";
import { getRepresentativeConfig } from "./thunk";
import type { RepresentativeConfig } from "@/libs/types/config";

interface stateType {
  loading: boolean;
  representativeConfig: RepresentativeConfig | null;
}

const initialState: stateType = {
  loading: false,
  representativeConfig: null,
};

export const manageConfigSlice = createSlice({
  name: "manageConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRepresentativeConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRepresentativeConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.representativeConfig = action.payload.data;
      })
      .addCase(getRepresentativeConfig.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageConfigReducer, actions: manageConfigActions } = manageConfigSlice;
