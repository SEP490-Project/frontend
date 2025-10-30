import { createSlice } from "@reduxjs/toolkit";
import { campaign, createCampaign, getCampaignsByBrand, getCampaignById } from "./thunk";
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
  campaignDetail: CampaignData | null;
  detailLoading: boolean;
  error: string | null;
}

const initialState: stateType = {
  loading: false,
  campaigns: [],
  pagination: null,
  campaignDetail: null,
  detailLoading: false,
  error: null,
};

export const manageCampaignSlice = createSlice({
  name: "manageCampaign",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
        state.campaigns = [];
        state.pagination = null;
        state.error = action.payload as string;
      })
      .addCase(getCampaignById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(getCampaignById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.campaignDetail = action.payload;
        state.error = null;
      })
      .addCase(getCampaignById.rejected, (state, action) => {
        state.detailLoading = false;
        state.campaignDetail = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = manageCampaignSlice.actions;
export const { reducer: manageCampaignReducer, actions: manageCampaignActions } =
  manageCampaignSlice;
