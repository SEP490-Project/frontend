// thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageAuthen } from "@/libs/services/manageAuthen";
import type { Login, Register } from "@/libs/types/auth";
import { AxiosError } from "axios";
import { setItem, setRaw } from "@/libs/local-storage";

export const login = createAsyncThunk("auth/login", async (req: Login, { rejectWithValue }) => {
  try {
    const response = await manageAuthen.login(req);
    const data = response.data?.data;

    // Lưu vào localStorage qua helper
    setRaw("access_token", data.access_token);
    setRaw("refresh_token", data.refresh_token);
    setItem("user", data.user);

    return data;
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
