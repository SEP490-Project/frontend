import { createSlice } from "@reduxjs/toolkit";
import {
  brandAffiliates,
  brandCampaigns,
  brandContent,
  brandContracts,
  brandRevenueTrend,
  brandTopProduct,
} from "./thunk";

interface stateType {
  loadingAffiliates: boolean;
  loadingCampaigns: boolean;
  loadingContent: boolean;
  loadingContracts: boolean;
  loadingRevenueTrend: boolean;
  loadingTopProducts: boolean;
  affiliates: any;
  campaigns: any;
  content: any;
  contracts: any;
  revenueTrend: any;
  topProducts: any;
}

const initialState: stateType = {
  loadingAffiliates: false,
  loadingCampaigns: false,
  loadingContent: false,
  loadingContracts: false,
  loadingRevenueTrend: false,
  loadingTopProducts: false,
  affiliates: null,
  campaigns: null,
  content: null,
  contracts: null,
  revenueTrend: null,
  topProducts: null,
};

export const manageBrandAnalyticSlice = createSlice({
  name: "manageBrandAnalytic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(brandAffiliates.pending, (state) => {
        state.loadingAffiliates = true;
      })
      .addCase(brandAffiliates.fulfilled, (state, action) => {
        state.loadingAffiliates = false;
        state.affiliates = action.payload.data;
      })
      .addCase(brandAffiliates.rejected, (state) => {
        state.loadingAffiliates = false;
      })

      .addCase(brandCampaigns.pending, (state) => {
        state.loadingCampaigns = true;
      })
      .addCase(brandCampaigns.fulfilled, (state, action) => {
        state.loadingCampaigns = false;
        state.campaigns = action.payload.data;
      })
      .addCase(brandCampaigns.rejected, (state) => {
        state.loadingCampaigns = false;
      })

      .addCase(brandContent.pending, (state) => {
        state.loadingContent = true;
      })
      .addCase(brandContent.fulfilled, (state, action) => {
        state.loadingContent = false;
        state.content = action.payload.data;
      })
      .addCase(brandContent.rejected, (state) => {
        state.loadingContent = false;
      })

      .addCase(brandContracts.pending, (state) => {
        state.loadingContracts = true;
      })
      .addCase(brandContracts.fulfilled, (state, action) => {
        state.loadingContracts = false;
        state.contracts = action.payload.data;
      })
      .addCase(brandContracts.rejected, (state) => {
        state.loadingContracts = false;
      })

      .addCase(brandRevenueTrend.pending, (state) => {
        state.loadingRevenueTrend = true;
      })
      .addCase(brandRevenueTrend.fulfilled, (state, action) => {
        state.loadingRevenueTrend = false;
        state.revenueTrend = action.payload.data;
      })
      .addCase(brandRevenueTrend.rejected, (state) => {
        state.loadingRevenueTrend = false;
      })

      .addCase(brandTopProduct.pending, (state) => {
        state.loadingTopProducts = true;
      })
      .addCase(brandTopProduct.fulfilled, (state, action) => {
        state.loadingTopProducts = false;
        state.topProducts = action.payload.data;
      })
      .addCase(brandTopProduct.rejected, (state) => {
        state.loadingTopProducts = false;
      });
  },
});

export const { reducer: manageBrandAnalyticReducer, actions: manageBrandAnalyticActions } =
  manageBrandAnalyticSlice;
