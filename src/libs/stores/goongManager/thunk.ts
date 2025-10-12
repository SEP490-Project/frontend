import { createAsyncThunk } from "@reduxjs/toolkit";
import { goongAutocompleteService } from "@/libs/services/manageGoong";
import { AxiosError } from "axios";

export const fetchPredictions = createAsyncThunk(
  "goong/fetchPredictions",
  async (input: string, { rejectWithValue }) => {
    try {
      const res = await goongAutocompleteService.getPredictions({ input });
      return res.data.predictions; // trả về danh sách gợi ý
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: { message: string } }>;
      return rejectWithValue(err.response?.data?.error?.message || "Autocomplete thất bại");
    }
  },
);
