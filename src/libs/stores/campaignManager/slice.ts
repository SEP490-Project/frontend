import { createSlice } from "@reduxjs/toolkit";
import {
  campaign,
  createCampaign,
  createInternalCampaign,
  getCampaignsByBrand,
  getCampaignById,
  approveCampaign,
  rejectCampaign,
} from "./thunk";
import type { CampaignData } from "@/libs/types/campaign";
import { toast } from "sonner";

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
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const message = action.payload.message || "Campaign created successfully";
        toast.success(message);
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        const message = (action.payload as string) || "Failed to create campaign";
        toast.error(message);
      })
      .addCase(createInternalCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInternalCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const message = action.payload.message || "Internal campaign created successfully";
        toast.success(message);
      })
      .addCase(createInternalCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        const message = (action.payload as string) || "Failed to create internal campaign";
        toast.error(message);
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
        state.campaignDetail = action.payload.data;
        state.error = null;
      })
      .addCase(getCampaignById.rejected, (state, action) => {
        state.detailLoading = false;
        state.campaignDetail = null;
        state.error = action.payload as string;
      })

      .addCase(approveCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const message = action.payload.message || "Campaign approved successfully";
        toast.success(message);
      })
      .addCase(approveCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        const message = (action.payload as string) || "Failed to approve campaign";
        toast.error(message);
      })

      .addCase(rejectCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const message = action.payload.message || "Campaign rejected successfully";
        toast.success(message);
      })
      .addCase(rejectCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        const message = (action.payload as string) || "Failed to reject campaign";
        toast.error(message);
      });
  },
});

export const { clearError } = manageCampaignSlice.actions;
export const { reducer: manageCampaignReducer, actions: manageCampaignActions } =
  manageCampaignSlice;
