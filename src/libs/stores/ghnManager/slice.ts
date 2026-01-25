import { createSlice } from "@reduxjs/toolkit";
import { getGHNInfoRaw, updateGHNOrderStatus } from "./thunk";
import type { GHNOrderInfo } from "@/libs/types/ghn";

interface stateType {
  loading: boolean;
  orderInfo: GHNOrderInfo | null;
  msg: string | null;
}

const initialState: stateType = {
  loading: false,
  orderInfo: null,
  msg: null,
};

export const ghnManagerSlice = createSlice({
  name: "ghnManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGHNInfoRaw.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGHNInfoRaw.fulfilled, (state, action) => {
        state.loading = false;
        state.orderInfo = action.payload;
        state.msg = action.payload.message;
      })
      .addCase(getGHNInfoRaw.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateGHNOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGHNOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.msg = action.payload.message;
      })
      .addCase(updateGHNOrderStatus.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: ghnManagerReducer, actions: ghnManagerActions } = ghnManagerSlice;
