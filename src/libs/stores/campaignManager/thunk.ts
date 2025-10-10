import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageCampaign } from "@/libs/services/manageCampaign";
import type { CampaignParams } from "@/libs/types/campaign";

export const getCampaignsByBrand = createAsyncThunk(
  "campaigns/getByBrand",
  async (req: CampaignParams, { rejectWithValue }) => {
    try {
      const response = await manageCampaign.getCampaignsByBrand(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch campaigns");
    }
  },
);

export const getCampaignById = createAsyncThunk(
  "campaigns/getById",
  async (campaignId: string, { rejectWithValue }) => {
    try {
      const response = await manageCampaign.getCampaignById(campaignId);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch campaign detail");
    }
  },
);
