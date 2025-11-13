import { createSlice } from "@reduxjs/toolkit";
import {
  marketingContents,
  marketingContentDetail,
  marketingApproveContent,
  marketingRejectContent,
} from "./thunk";
import type { ListContent } from "@/libs/types/content";
import { toast } from "sonner";

interface stateType {
  loading: boolean;
  contents: ListContent[];
  content: ListContent | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
}

const initialState: stateType = {
  loading: false,
  contents: [],
  content: null,
  pagination: null,
};

export const manageContentMarketingSlice = createSlice({
  name: "manageContentMarketing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(marketingContents.pending, (state) => {
        state.loading = true;
      })
      .addCase(marketingContents.fulfilled, (state, action) => {
        state.loading = false;
        state.contents = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(marketingContents.rejected, (state) => {
        state.loading = false;
      })

      .addCase(marketingContentDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(marketingContentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload.data;
      })
      .addCase(marketingContentDetail.rejected, (state) => {
        state.loading = false;
      })

      .addCase(marketingApproveContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(marketingApproveContent.fulfilled, (state, action) => {
        state.loading = false;
        const message = action.payload?.message || "Content approved successfully";
        toast.success(message);
      })
      .addCase(marketingApproveContent.rejected, (state, action) => {
        state.loading = false;
        const message = (action.payload as string) || "Failed to approve content";
        toast.error(message);
      })

      .addCase(marketingRejectContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(marketingRejectContent.fulfilled, (state, action) => {
        state.loading = false;
        const message = action.payload?.message || "Content rejected successfully";
        toast.success(message);
      })
      .addCase(marketingRejectContent.rejected, (state, action) => {
        state.loading = false;
        const message = (action.payload as string) || "Failed to reject content";
        toast.error(message);
      });
  },
});

export const { reducer: manageContentMarketingReducer, actions: manageContentMarketingActions } =
  manageContentMarketingSlice;
