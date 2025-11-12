import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageCampaign } from "@/libs/services/manageCampaign";
import type { CampaignParams, CampaignRequest } from "@/libs/types/campaign";

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
      return response.data.data; // Return the actual campaign data, not the wrapper
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch campaign detail");
    }
  },
);

export const campaign = createAsyncThunk(
  "/campaigns",
  async (
    req: {
      page: number;
      limit: number;
      keyword?: string;
      status?: string;
      type?: string;
      start_date: string;
      end_date: string;
      sort_by: string;
      sort_order: string;
    },
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

export const createCampaign = createAsyncThunk(
  "/campaigns/create",
  async (req: CampaignRequest, { rejectWithValue }) => {
    try {
      const response = await manageCampaign.CreateCampaign(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const createInternalCampaign = createAsyncThunk(
  "/campaigns/create/internal",
  async (req: CampaignRequest, { rejectWithValue }) => {
    try {
      const response = await manageCampaign.createInternalCampaign(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const approveCampaign = createAsyncThunk(
  "/campaigns/approve",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageCampaign.approveCampaign(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const rejectCampaign = createAsyncThunk(
  "/campaigns/reject",
  async ({ id, reason }: { id: string; reason?: string }, { rejectWithValue }) => {
    try {
      const response = await manageCampaign.rejectCampaign(id, reason);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
