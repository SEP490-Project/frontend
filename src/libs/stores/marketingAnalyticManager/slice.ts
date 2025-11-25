import { createSlice } from "@reduxjs/toolkit";
import { dashboard } from "./thunk";
// import type { Bank } from "@/libs/types/bank";

interface stateType {
  loading: boolean;
  dashboard: any;
}

const initialState: stateType = {
  loading: false,
  dashboard: [],
};

export const manageMarketingAnalyticSlice = createSlice({
  name: "manageMarketingAnalytic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(dashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(dashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data;
      })
      .addCase(dashboard.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageMarketingAnalyticReducer, actions: manageMarketingAnalyticActions } =
  manageMarketingAnalyticSlice;
