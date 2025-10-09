import { createSlice } from "@reduxjs/toolkit";
import { fetchPredictions } from "./thunk";
import type { GoongPrediction } from "@/libs/types/goong";

interface GoongState {
  loading: boolean;
  predictions: GoongPrediction[];
  error: string | null;
}

const initialState: GoongState = {
  loading: false,
  predictions: [],
  error: null,
};

export const manageGoongSlice = createSlice({
  name: "goongManager",
  initialState,
  reducers: {
    clearPredictions: (state) => {
      state.predictions = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPredictions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions = action.payload;
      })
      .addCase(fetchPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPredictions } = manageGoongSlice.actions;
export const { reducer: manageGoongReducer } = manageGoongSlice;
