import { createSlice } from "@reduxjs/toolkit";
import { getReviewsForStaffThunk } from "./thunk";
import type { ReviewData, ReviewResponse } from "@/libs/types/review";

const reviewManagerSlice = createSlice({
  name: "reviewManager",
  initialState: {
    reviews: null as ReviewResponse<ReviewData> | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviewsForStaffThunk.pending, (state) => {
        state.reviews = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewsForStaffThunk.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getReviewsForStaffThunk.rejected, (state, action) => {
        state.reviews = null;
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reviews";
      });
  },
});

export const { reducer: reviewManagerReducers, actions: reviewManagerActions } = reviewManagerSlice;
