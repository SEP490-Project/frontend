import { manageUser } from "@/libs/services/manageUser";
import type { UserData, UserParams, UserResponse } from "@/libs/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getProfileThunk = createAsyncThunk("userManager/getProfile", async (_, thunkAPI) => {
  try {
    const response = await manageUser.getProfile();
    return response.data as UserResponse<UserData>;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

const updateProfileThunk = createAsyncThunk(
  "userManager/updateProfile",
  async (updateData: UserData, thunkAPI) => {
    try {
      const response = await manageUser.updateProfile(updateData);
      return response.data as UserResponse<UserData>;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const getAllUsersThunk = createAsyncThunk(
  "userManager/getAllUsers",
  async (params: UserParams, thunkAPI) => {
    try {
      const response = await manageUser.getAllUsers(params);
      return response.data as UserResponse<UserData[]>;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const updateUserStatusThunk = createAsyncThunk(
  "userManager/updateUserStatus",
  async ({ is_active, userId }: { is_active: boolean; userId: string }, thunkAPI) => {
    try {
      const response = await manageUser.updateUserStatus(is_active, userId);
      return response.data as UserResponse<UserData>;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export { getProfileThunk, updateProfileThunk, getAllUsersThunk, updateUserStatusThunk };
