import { createSlice } from "@reduxjs/toolkit";
import {
  marketingDashboard,
  marketingActiveBrand,
  marketingActiveCampaign,
  marketingDraftCampaign,
  marketingMonthlyRevenue,
  marketingRevenueType,
  marketingTopBrand,
  marketingUpcomingDeadline,
} from "./thunk";

interface stateType {
  loading: boolean;
  loadingKPI: boolean;
  loadingRevenue: boolean;
  loadingTopBrands: boolean;
  loadingDeadlines: boolean;
  dashboard: any;
  activeBrands: any;
  activeCampaigns: any;
  draftCampaigns: any;
  monthlyRevenue: any;
  revenueByType: any;
  topBrands: any;
  upcomingDeadlines: any;
}

const initialState: stateType = {
  loading: false,
  loadingKPI: false,
  loadingRevenue: false,
  loadingTopBrands: false,
  loadingDeadlines: false,
  dashboard: [],
  activeBrands: null,
  activeCampaigns: null,
  draftCampaigns: null,
  monthlyRevenue: null,
  revenueByType: null,
  topBrands: null,
  upcomingDeadlines: null,
};

export const manageMarketingAnalyticSlice = createSlice({
  name: "manageMarketingAnalytic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(marketingDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(marketingDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data;
      })
      .addCase(marketingDashboard.rejected, (state) => {
        state.loading = false;
      })

      .addCase(marketingActiveBrand.pending, (state) => {
        state.loadingKPI = true;
      })
      .addCase(marketingActiveBrand.fulfilled, (state, action) => {
        state.loadingKPI = false;
        state.activeBrands = action.payload.data;
      })
      .addCase(marketingActiveBrand.rejected, (state) => {
        state.loadingKPI = false;
      })

      .addCase(marketingActiveCampaign.pending, (state) => {
        state.loadingKPI = true;
      })
      .addCase(marketingActiveCampaign.fulfilled, (state, action) => {
        state.loadingKPI = false;
        state.activeCampaigns = action.payload.data;
      })
      .addCase(marketingActiveCampaign.rejected, (state) => {
        state.loadingKPI = false;
      })

      .addCase(marketingDraftCampaign.pending, (state) => {
        state.loadingKPI = true;
      })
      .addCase(marketingDraftCampaign.fulfilled, (state, action) => {
        state.loadingKPI = false;
        state.draftCampaigns = action.payload.data;
      })
      .addCase(marketingDraftCampaign.rejected, (state) => {
        state.loadingKPI = false;
      })

      .addCase(marketingMonthlyRevenue.pending, (state) => {
        state.loadingKPI = true;
      })
      .addCase(marketingMonthlyRevenue.fulfilled, (state, action) => {
        state.loadingKPI = false;
        state.monthlyRevenue = action.payload.data;
      })
      .addCase(marketingMonthlyRevenue.rejected, (state) => {
        state.loadingKPI = false;
      })

      .addCase(marketingRevenueType.pending, (state) => {
        state.loadingRevenue = true;
      })
      .addCase(marketingRevenueType.fulfilled, (state, action) => {
        state.loadingRevenue = false;
        state.revenueByType = action.payload.data;
      })
      .addCase(marketingRevenueType.rejected, (state) => {
        state.loadingRevenue = false;
      })

      .addCase(marketingTopBrand.pending, (state) => {
        state.loadingTopBrands = true;
      })
      .addCase(marketingTopBrand.fulfilled, (state, action) => {
        state.loadingTopBrands = false;
        state.topBrands = action.payload.data;
      })
      .addCase(marketingTopBrand.rejected, (state) => {
        state.loadingTopBrands = false;
      })

      .addCase(marketingUpcomingDeadline.pending, (state) => {
        state.loadingDeadlines = true;
      })
      .addCase(marketingUpcomingDeadline.fulfilled, (state, action) => {
        state.loadingDeadlines = false;
        state.upcomingDeadlines = action.payload.data;
      })
      .addCase(marketingUpcomingDeadline.rejected, (state) => {
        state.loadingDeadlines = false;
      });
  },
});

export const { reducer: manageMarketingAnalyticReducer, actions: manageMarketingAnalyticActions } =
  manageMarketingAnalyticSlice;
