import { createSlice } from "@reduxjs/toolkit";
import { campaign, getCampaignsByBrand, getCampaignById } from "./thunk";
import type { CampaignData } from "@/libs/types/campaign";

interface stateType {
  loading: boolean;
  campaigns: CampaignData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
  detailLoading: boolean;
  campaignDetail: CampaignData | null;
  error: string | null;
}

const initialState: stateType = {
  loading: false,
  campaigns: [],
  pagination: null,
  detailLoading: false,
  campaignDetail: null,
  error: null,
};

export const manageCampaignSlice = createSlice({
  name: "manageCampaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Generic campaigns
      .addCase(campaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(campaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(campaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get campaigns by brand
      .addCase(getCampaignsByBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCampaignsByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getCampaignsByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get campaign by ID
      .addCase(getCampaignById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(getCampaignById.fulfilled, (state, action) => {
        state.detailLoading = false;
        // The API returns { data: CampaignData, ... } structure
        state.campaignDetail = action.payload.data;
        state.error = null;
      })
      .addCase(getCampaignById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { reducer: manageCampaignReducer, actions: manageCampaignActions } =
  manageCampaignSlice;
