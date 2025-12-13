import { createSlice } from "@reduxjs/toolkit";
import { getRepresentativeConfig, getPrivacyPolicy, getTermsOfService } from "./thunk";
import type { RepresentativeConfig } from "@/libs/types/config";

interface stateType {
  loading: boolean;
  representativeConfig: RepresentativeConfig | null;
  termsOfService: any | null;
  privacyPolicy: any | null;
}

const initialState: stateType = {
  loading: false,
  representativeConfig: null,
  termsOfService: null,
  privacyPolicy: null,
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
      })
      .addCase(getTermsOfService.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTermsOfService.fulfilled, (state, action) => {
        state.loading = false;
        state.termsOfService = action.payload.data;
      })
      .addCase(getTermsOfService.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getPrivacyPolicy.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.privacyPolicy = action.payload.data;
      })
      .addCase(getPrivacyPolicy.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageConfigReducer, actions: manageConfigActions } = manageConfigSlice;
