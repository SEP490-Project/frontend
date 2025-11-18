import { createSlice } from "@reduxjs/toolkit";
import { updateProductStateThunk, updateTaskStateThunk, updatePreOrderStateThunk } from "./thunk";

const stateManagerSlice = createSlice({
  name: "stateManager",
  initialState: {
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateTaskStateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStateThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTaskStateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProductStateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductStateThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProductStateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePreOrderStateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreOrderStateThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePreOrderStateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { reducer: stateManagerReducer } = stateManagerSlice;
