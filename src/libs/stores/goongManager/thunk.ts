import { createAsyncThunk } from "@reduxjs/toolkit";
import { goongAutocompleteService, goongDirectionsService } from "@/libs/services/manageGoong";
import { AxiosError } from "axios";

export const fetchPredictions = createAsyncThunk(
  "goong/fetchPredictions",
  async (input: string, { rejectWithValue }) => {
    try {
      const res = await goongAutocompleteService.getPredictions({ input });
      return res.data.predictions; // trả về danh sách gợi ý
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: { message: string } }>;
      return rejectWithValue(err.response?.data?.error?.message || "Autocomplete Failed");
    }
  },
);

export const getDirections = createAsyncThunk(
  "goong/getDirections",
  async (params: { origin: string; destination: string; vehicle: string }, { rejectWithValue }) => {
    try {
      const res = await goongDirectionsService.getDirections(
        params.origin,
        params.destination,
        params.vehicle,
      );
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: { message: string } }>;
      return rejectWithValue(err.response?.data?.error?.message || "Lấy chỉ đường Failed");
    }
  },
);
