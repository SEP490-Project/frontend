import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageCampaign } from "@/libs/services/manageCampaign";

export const campaign = createAsyncThunk(
  "/campaigns",
  async (
    req: { page: number; limit: number; keywords?: string; status?: string; type?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageCampaign.campaign(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
