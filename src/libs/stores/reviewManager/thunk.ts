import manageReview from "@/libs/services/manageReview";
import type { ReviewData, ReviewResponse } from "@/libs/types/review";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getReviewsForStaffThunk = createAsyncThunk(
  "reviewManager/getReviewsForStaff",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageReview.getReviewsForStaff();
      return response.data as ReviewResponse<ReviewData>;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export { getReviewsForStaffThunk };
