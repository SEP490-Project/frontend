import { createSlice } from "@reduxjs/toolkit";
import { login, register, refresh, logout } from "./thunk";
import { getInitialAuthState } from "@/libs/helper/helper";
import { setRaw, setItem, removeItem } from "@/libs/local-storage";
import { toast } from "sonner";

const initialState = getInitialAuthState();

export const manageAuthenSlice = createSlice({
  name: "authentManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.user.role;

        toast.success(`Welcome back, ${action.payload.user.username || "User"}!`);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        toast.error(String(action.payload || "Login failed. Please check your credentials."));
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        toast.success("Registration successful! You can now sign in.");
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        toast.error(String(action.payload || "Registration failed. Please try again."));
      })

      .addCase(refresh.pending, (state) => {
        state.loading = true;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        setRaw("access_token", data.access_token);
        setRaw("refresh_token", data.refresh_token);
        setItem("user", data.user);
        state.isAuthenticated = true;
        state.user = data.user;
        state.role = data.user.role;
      })
      .addCase(refresh.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = "";
        removeItem("access_token");
        removeItem("refresh_token");
        removeItem("user");
        toast.error("Session expired. Please sign in again.");
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = "";
        toast.info("You have signed out successfully.");
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = "";
      });
  },
});

export const { reducer: manageAuthenReducer, actions: manageAuthenActions } = manageAuthenSlice;
