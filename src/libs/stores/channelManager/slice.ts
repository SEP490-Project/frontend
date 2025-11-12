import { createSlice } from "@reduxjs/toolkit";
import { channelList } from "./thunk";
import type { Channel } from "@/libs/types/channel";

interface stateType {
  loading: boolean;
  channel: Channel[];
}

const initialState: stateType = {
  loading: false,
  channel: [],
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
      });
  },
});

export const { reducer: manageChannelReducer, actions: manageChannelActions } = manageChannelSlice;
