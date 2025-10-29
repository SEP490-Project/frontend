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
}

const initialState: stateType = {
  loading: false,
  campaigns: [],
  pagination: null,
  campaignDetail: null,
  detailLoading: false,
};

export const manageCampaignSlice = createSlice({
  name: "manageCampaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(campaign.pending, (state) => {
        state.loading = true;
      })
      .addCase(campaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(campaign.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCampaign.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCampaign.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getCampaignsByBrand.pending, (state) => {
        state.loading = true;
      })

      .addCase(getCampaignsByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getCampaignsByBrand.rejected, (state) => {
        state.loading = false;
        state.campaigns = [];
        state.pagination = null;
      })

      .addCase(getCampaignById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(getCampaignById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.campaignDetail = action.payload;
      })
      .addCase(getCampaignById.rejected, (state) => {
        state.detailLoading = false;
        state.campaignDetail = null;
      });
  },
});

export const { reducer: manageCampaignReducer, actions: manageCampaignActions } =
  manageCampaignSlice;
