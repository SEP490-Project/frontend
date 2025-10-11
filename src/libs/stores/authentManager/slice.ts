import { createSlice } from "@reduxjs/toolkit";
import { login, register, refresh, logout } from "./thunk";
import { getInitialAuthState } from "@/libs/helper/helper";
import { toast } from "sonner";

const initialState = getInitialAuthState();

export const manageAuthenSlice = createSlice({
  name: "authentManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---- LOGIN ----
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

        toast.success(`Welcome back, ${action.payload.user.username || "User"}!`);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        toast.error(String(action.payload || "Login failed. Please check your credentials."));
      })

      // ---- REGISTER ----
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        toast.success("Registration successful! You can now sign in.");
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(String(action.payload || "Registration failed. Please try again."));
      })

      // ---- REFRESH TOKEN ----
      .addCase(refresh.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
      })
      .addCase(refresh.rejected, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.role = "";
        toast.error("Session expired. Please sign in again.");
      })

      // ---- LOGOUT ----
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.role = "";
        toast.info("You have signed out successfully.");
      });
  },
});

export const { reducer: manageAuthenReducer, actions: manageAuthenActions } = manageAuthenSlice;
