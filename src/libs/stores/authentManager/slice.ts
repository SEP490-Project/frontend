import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./thunk";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  role: string;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
  role: "",
  user: null,
  accessToken: null,
  refreshToken: null,
  error: null,
};

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
      localStorage.clear();
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

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        // có thể set gì đó nếu API trả về luôn user
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { reducer: manageAuthenReducer, actions: manageAuthenActions } = manageAuthenSlice;
