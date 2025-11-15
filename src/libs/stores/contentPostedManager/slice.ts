import { createSlice } from "@reduxjs/toolkit";
import { postedContents, postedContentDetail } from "./thunk";
import type { ListContent } from "@/libs/types/content";

interface stateType {
  loading: boolean;
  postedContents: ListContent[];
  postedContent: ListContent | null;
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
  postedContents: [],
  postedContent: null,
  pagination: null,
};

export const managePostedContentSlice = createSlice({
  name: "managePostedContent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postedContents.pending, (state) => {
        state.loading = true;
      })
      .addCase(postedContents.fulfilled, (state, action) => {
        state.loading = false;
        state.postedContents = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(postedContents.rejected, (state) => {
        state.loading = false;
      })

      .addCase(postedContentDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(postedContentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.postedContent = action.payload.data;
      })
      .addCase(postedContentDetail.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: managePostedContentReducer, actions: managePostedContentActions } =
  managePostedContentSlice;
