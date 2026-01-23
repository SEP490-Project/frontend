import manageReview from "@/libs/services/manageReview";
import type { ReviewData, ReviewQueryParams, ReviewResponse } from "@/libs/types/review";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getReviewsForStaffThunk = createAsyncThunk(
  "reviewManager/getReviewsForStaff",
  async (queryParams: ReviewQueryParams, { rejectWithValue }) => {
    try {
      const response = await manageReview.getReviewsForStaff(queryParams);
      return response.data as ReviewResponse<ReviewData>;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export { getReviewsForStaffThunk };
