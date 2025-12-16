import { createSlice } from "@reduxjs/toolkit";
import {
  adminCampaigns,
  adminContracts,
  adminHealth,
  adminRevenue,
  adminUserGrowth,
  adminUserOverview,
  adminSystemOverview,
} from "./thunk";

interface stateType {
  loading: boolean;
  loadingRevenue: boolean;
  loadingUserGrowth: boolean;
  loadingUserOverview: boolean;
  loadingSystemOverview: boolean;
  campaigns: any;
  contracts: any;
  health: any;
  revenue: any;
  userGrowth: any;
  userOverview: any;
  systemOverview: any;
}

const initialState: stateType = {
  loading: false,
  loadingRevenue: false,
  loadingUserGrowth: false,
  loadingUserOverview: false,
  loadingSystemOverview: false,
  campaigns: null,
  contracts: null,
  health: null,
  revenue: null,
  userGrowth: null,
  userOverview: null,
  systemOverview: null,
};

export const manageAdminAnalyticSlice = createSlice({
  name: "manageAdminAnalytic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminCampaigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.data;
      })
      .addCase(adminCampaigns.rejected, (state) => {
        state.loading = false;
      })

      .addCase(adminContracts.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload.data;
      })
      .addCase(adminContracts.rejected, (state) => {
        state.loading = false;
      })

      .addCase(adminHealth.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.health = action.payload.data;
      })
      .addCase(adminHealth.rejected, (state) => {
        state.loading = false;
      })

      .addCase(adminRevenue.pending, (state) => {
        state.loadingRevenue = true;
      })
      .addCase(adminRevenue.fulfilled, (state, action) => {
        state.loadingRevenue = false;
        state.revenue = action.payload.data;
      })
      .addCase(adminRevenue.rejected, (state) => {
        state.loadingRevenue = false;
      })

      .addCase(adminUserGrowth.pending, (state) => {
        state.loadingUserGrowth = true;
      })
      .addCase(adminUserGrowth.fulfilled, (state, action) => {
        state.loadingUserGrowth = false;
        state.userGrowth = action.payload.data;
      })
      .addCase(adminUserGrowth.rejected, (state) => {
        state.loadingUserGrowth = false;
      })

      .addCase(adminUserOverview.pending, (state) => {
        state.loadingUserOverview = true;
      })
      .addCase(adminUserOverview.fulfilled, (state, action) => {
        state.loadingUserOverview = false;
        state.userOverview = action.payload.data;
      })
      .addCase(adminUserOverview.rejected, (state) => {
        state.loadingUserOverview = false;
      })

      .addCase(adminSystemOverview.pending, (state) => {
        state.loadingSystemOverview = true;
      })
      .addCase(adminSystemOverview.fulfilled, (state, action) => {
        state.loadingSystemOverview = false;
        state.systemOverview = action.payload.data;
      })
      .addCase(adminSystemOverview.rejected, (state) => {
        state.loadingSystemOverview = false;
      });
  },
});

export const { reducer: manageAdminAnalyticReducer, actions: manageAdminAnalyticActions } =
  manageAdminAnalyticSlice;
