import { createSlice } from "@reduxjs/toolkit";
import { getCampaignsByBrand, getCampaignById } from "./thunk";
import type { Campaign } from "@/libs/types/campaign";

interface CampaignState {
  loading: boolean;
  campaigns: Campaign[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  } | null;
  campaignDetail: Campaign | null;
  detailLoading: boolean;
}

const initialState: CampaignState = {
  loading: false,
  campaigns: [],
  pagination: null,
  campaignDetail: null,
  detailLoading: false,
};

const campaignSlice = createSlice({
  name: "manageCampaign",
  initialState,
  reducers: {
    clearCampaigns: (state) => {
      state.campaigns = [];
      state.pagination = null;
    },
    clearCampaignDetail: (state) => {
      state.campaignDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get campaigns by brand
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
      // Get campaign by id
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

export const { clearCampaigns, clearCampaignDetail } = campaignSlice.actions;
export default campaignSlice.reducer;
