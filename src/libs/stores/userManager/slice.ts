import { createSlice } from "@reduxjs/toolkit";
import { activateBrandThunk, getAllUsersThunk, getProfileThunk, updateProfileThunk } from "./thunk";
import type { UserData, UserResponse } from "@/libs/types/user";

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: {
    userProfile: null as UserResponse<UserData> | null,
    loading: false,
    error: null as string | null,
  },
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

const userManagerSlice = createSlice({
  name: "userManager",
  initialState: {
    users: null as UserResponse<UserData[]> | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUsersThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllUsersThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(getAllUsersThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | null;
    });
    builder.addCase(updateProfileThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProfileThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateProfileThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | null;
    });
    builder.addCase(activateBrandThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(activateBrandThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(activateBrandThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | null;
    });
  },
});

export const { reducer: userProfileReducer, actions: userProfileActions } = userProfileSlice;
export const { reducer: manageUserReducer, actions: manageUserActions } = userManagerSlice;
