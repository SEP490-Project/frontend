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
