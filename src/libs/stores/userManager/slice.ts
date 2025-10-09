import { createSlice } from "@reduxjs/toolkit";
import { getProfileThunk, updateProfileThunk } from "./thunk";
import type { UserResponse } from "@/libs/types/user";

interface UserManagerState {
  userProfile: UserResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserManagerState = {
  userProfile: null,
  loading: false,
  error: null,
};

const userManagerSlice = createSlice({
  name: "userManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProfileThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProfileThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.userProfile = action.payload;
    });
    builder.addCase(getProfileThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | null;
    });
    builder.addCase(updateProfileThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.userProfile = action.payload;
    });
    builder.addCase(updateProfileThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | null;
    });
  },
});

export const { reducer: manageUserReducer, actions: manageUserActions } = userManagerSlice;
