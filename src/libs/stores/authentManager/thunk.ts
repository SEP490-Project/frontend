import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageAuthen } from "@/libs/services/manageAuthen";
import type { Login, Register } from "@/libs/types/auth";
import { AxiosError } from "axios";
import { setItem, setRaw, getRaw, removeItem } from "@/libs/local-storage";

export const login = createAsyncThunk("auth/login", async (req: Login, { rejectWithValue }) => {
  try {
    const response = await manageAuthen.login(req);
    const data = response.data?.data;

    setRaw("access_token", data.access_token);
    setRaw("refresh_token", data.refresh_token);
    setItem("user", data.user);

    return data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message || "Đăng nhập thất bại");
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (req: Register, { rejectWithValue }) => {
    try {
      const response = await manageAuthen.register(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(err.response?.data?.message || "Đăng ký thất bại");
    }
  },
);

export const refresh = createAsyncThunk("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = getRaw("refresh_token");
    if (!refreshToken) throw new Error("Refresh token doesn't exist");

    const response = await manageAuthen.refresh({ refresh_token: refreshToken });
    const data = response.data?.data;

    setRaw("access_token", data.access_token);
    return data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message || "Làm mới token thất bại");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    const refreshToken = getRaw("refresh_token");
    if (!refreshToken) throw new Error("Refresh token doesn't exist");
    const response = await manageAuthen.logout({ refresh_token: refreshToken });
    const data = response.data?.data;
    return data;
  } catch (error: unknown) {
    console.log("Logout failed:", error);
  } finally {
    removeItem("access_token");
    removeItem("refresh_token");
    removeItem("user");
  }
});
