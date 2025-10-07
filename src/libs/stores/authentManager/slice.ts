import { createSlice } from "@reduxjs/toolkit";
import { login, register, refresh, logout } from "./thunk";
import { getInitialAuthState } from "@/libs/helper";

const initialState = getInitialAuthState();

export const manageAuthenSlice = createSlice({
  name: "authentManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
      })
      .addCase(refresh.rejected, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.role = "";
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.role = "";
      });
  },
});

export const { reducer: manageAuthenReducer } = manageAuthenSlice;
