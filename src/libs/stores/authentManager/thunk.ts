import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageAuthen } from "@/libs/services/manageAuthen";
import type { Login, Register } from "@/libs/types/auth";
import { AxiosError } from "axios";

export const login = createAsyncThunk("auth/login", async (req: Login, { rejectWithValue }) => {
  try {
    const response = await manageAuthen.login(req);
    const token = response.data?.data.access_token;
    const role = response.data?.data.role;
    const allowedRoles = ["Company", "Admin"];

    if (!token || !role || !allowedRoles.includes(role)) {
      return rejectWithValue("Tài khoản không tồn tại hoặc không được phép truy cập");
    }

    localStorage.setItem("authToken", token);
    localStorage.setItem("role", role);

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (req: Register, { rejectWithValue }) => {
    try {
      const response = await manageAuthen.register(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
