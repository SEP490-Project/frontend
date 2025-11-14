import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageChannel } from "@/libs/services/manageChannel";
import { AxiosError } from "axios";

export const channelList = createAsyncThunk("channelList", async (_, { rejectWithValue }) => {
  try {
    const response = await manageChannel.channelList();
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});

export const connectFacebookChannel = createAsyncThunk(
  "channel/connectFacebook",
  async (
    params: { redirectUrl: string; cancelUrl: string; is_internal?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageChannel.connectFacebook(params);
      // Redirect to OAuth URL
      if (response.data?.data?.url) {
        window.location.href = response.data.data.url;
      }
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Facebook connection failed");
    }
  },
);

export const connectTikTokChannel = createAsyncThunk(
  "channel/connectTikTok",
  async (
    params: { redirectUrl: string; cancelUrl: string; is_internal?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageChannel.connectTikTok(params);
      // Redirect to OAuth URL
      if (response.data?.data?.url) {
        window.location.href = response.data.data.url;
      }
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "TikTok connection failed");
    }
  },
);
