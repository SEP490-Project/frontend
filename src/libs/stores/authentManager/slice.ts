import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./thunk";
import { getInitialAuthState } from "@/libs/helper";
import { setItem } from "@/libs/local-storage";

const initialState = getInitialAuthState();

export const manageAuthenSlice = createSlice({
  name: "authentManager",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = "";
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      // clear local storage keys
      setItem("access_token", null);
      setItem("refresh_token", null);
      setItem("user", null);
    },
  },
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
      });
  },
});

export const { reducer: manageAuthenReducer, actions: manageAuthenActions } = manageAuthenSlice;
