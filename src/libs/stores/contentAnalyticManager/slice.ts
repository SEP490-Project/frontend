import { createSlice } from "@reduxjs/toolkit";
import {
  contentCampaign,
  contentChannel,
  contentPlatform,
  contentStatus,
  contentTop,
  contentTrend,
} from "./thunk";

interface stateType {
  loadingCampaigns: boolean;
  loadingChannel: boolean;
  loadingPlatform: boolean;
  loadingStatus: boolean;
  loadingTop: boolean;
  loadingTrend: boolean;
  campaigns: any;
  channel: any;
  platform: any;
  status: any;
  top: any;
  trend: any;
}

const initialState: stateType = {
  loadingCampaigns: false,
  loadingChannel: false,
  loadingPlatform: false,
  loadingStatus: false,
  loadingTop: false,
  loadingTrend: false,
  campaigns: null,
  channel: null,
  platform: null,
  status: null,
  top: null,
  trend: null,
};

export const manageContentAnalyticSlice = createSlice({
  name: "manageContentAnalytic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(contentCampaign.pending, (state) => {
        state.loadingCampaigns = true;
      })
      .addCase(contentCampaign.fulfilled, (state, action) => {
        state.loadingCampaigns = false;
        state.campaigns = action.payload.data;
      })
      .addCase(contentCampaign.rejected, (state) => {
        state.loadingCampaigns = false;
      })

      .addCase(contentChannel.pending, (state) => {
        state.loadingChannel = true;
      })
      .addCase(contentChannel.fulfilled, (state, action) => {
        state.loadingChannel = false;
        state.channel = action.payload.data;
      })
      .addCase(contentChannel.rejected, (state) => {
        state.loadingChannel = false;
      })

      .addCase(contentPlatform.pending, (state) => {
        state.loadingPlatform = true;
      })
      .addCase(contentPlatform.fulfilled, (state, action) => {
        state.loadingPlatform = false;
        state.platform = action.payload.data;
      })
      .addCase(contentPlatform.rejected, (state) => {
        state.loadingPlatform = false;
      })

      .addCase(contentStatus.pending, (state) => {
        state.loadingStatus = true;
      })
      .addCase(contentStatus.fulfilled, (state, action) => {
        state.loadingStatus = false;
        state.status = action.payload.data;
      })
      .addCase(contentStatus.rejected, (state) => {
        state.loadingStatus = false;
      })

      .addCase(contentTop.pending, (state) => {
        state.loadingTop = true;
      })
      .addCase(contentTop.fulfilled, (state, action) => {
        state.loadingTop = false;
        state.top = action.payload.data;
      })
      .addCase(contentTop.rejected, (state) => {
        state.loadingTop = false;
      })

      .addCase(contentTrend.pending, (state) => {
        state.loadingTrend = true;
      })
      .addCase(contentTrend.fulfilled, (state, action) => {
        state.loadingTrend = false;
        state.trend = action.payload.data;
      })
      .addCase(contentTrend.rejected, (state) => {
        state.loadingTrend = false;
      });
  },
});

export const { reducer: manageContentAnalyticReducer, actions: manageContentAnalyticActions } =
  manageContentAnalyticSlice;
