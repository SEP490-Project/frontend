import { createSlice } from "@reduxjs/toolkit";
import { channelList, connectFacebookChannel, connectTikTokChannel } from "./thunk";
import type { Channel } from "@/libs/types/channel";
import { toast } from "sonner";

interface stateType {
  loading: boolean;
  channel: Channel[];
  connectingChannel: string | null;
}

const initialState: stateType = {
  loading: false,
  channel: [],
  connectingChannel: null,
};

export const manageChannelSlice = createSlice({
  name: "manageChannel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(channelList.pending, (state) => {
        state.loading = true;
      })
      .addCase(channelList.fulfilled, (state, action) => {
        state.loading = false;
        state.channel = action.payload.data;
      })
      .addCase(channelList.rejected, (state) => {
        state.loading = false;
      })

      .addCase(connectFacebookChannel.pending, (state) => {
        state.connectingChannel = "Facebook";
        toast.info("Redirecting to Facebook authentication...");
      })
      .addCase(connectFacebookChannel.fulfilled, (state) => {
        state.connectingChannel = null;
      })
      .addCase(connectFacebookChannel.rejected, (state, action) => {
        state.connectingChannel = null;
        toast.error(String(action.payload || "Failed to connect Facebook channel"));
      })

      .addCase(connectTikTokChannel.pending, (state) => {
        state.connectingChannel = "TikTok";
        toast.info("Redirecting to TikTok authentication...");
      })
      .addCase(connectTikTokChannel.fulfilled, (state) => {
        state.connectingChannel = null;
      })
      .addCase(connectTikTokChannel.rejected, (state, action) => {
        state.connectingChannel = null;
        toast.error(String(action.payload || "Failed to connect TikTok channel"));
      });
  },
});

export const { reducer: manageChannelReducer, actions: manageChannelActions } = manageChannelSlice;
