import { createSlice } from "@reduxjs/toolkit";
import {
  getAllConfigs,
  getRepresentativeConfig,
  getPrivacyPolicy,
  getTermsOfService,
  updateConfig,
  bulkUpdateConfigs,
  getValueByConfigKey,
} from "./thunk";
import type { RepresentativeConfig } from "@/libs/types/config";

interface stateType {
  loading: boolean;
  updating: boolean;
  allConfigs: any | null;
  representativeConfig: RepresentativeConfig | null;
  termsOfService: any | null;
  privacyPolicy: any | null;
  configValue?: any | null;
}

const initialState: stateType = {
  loading: false,
  updating: false,
  allConfigs: null,
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
      .addCase(getAllConfigs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.allConfigs = action.payload.data;
      })
      .addCase(getAllConfigs.rejected, (state) => {
        state.loading = false;
      })
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
      })
      .addCase(updateConfig.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateConfig.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateConfig.rejected, (state) => {
        state.updating = false;
      })
      .addCase(bulkUpdateConfigs.pending, (state) => {
        state.updating = true;
      })
      .addCase(bulkUpdateConfigs.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(bulkUpdateConfigs.rejected, (state) => {
        state.updating = false;
      })
      .addCase(getValueByConfigKey.pending, (state) => {
        state.loading = true;
      })
      .addCase(getValueByConfigKey.fulfilled, (state, action) => {
        state.loading = false;
        state.configValue = action.payload.data;
      })
      .addCase(getValueByConfigKey.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageConfigReducer, actions: manageConfigActions } = manageConfigSlice;
