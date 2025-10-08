import { manageUser } from "@/libs/services/manageUser";
import type { UserData, UserResponse } from "@/libs/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getProfileThunk = createAsyncThunk("userManager/getProfile", async (_, thunkAPI) => {
  try {
    const response = await manageUser.getProfile();
    return response.data as UserResponse;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

const updateProfileThunk = createAsyncThunk(
  "userManager/updateProfile",
  async (updateData: UserData, thunkAPI) => {
    try {
      const response = await manageUser.updateProfile(updateData);
      return response.data as UserResponse;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export { getProfileThunk, updateProfileThunk };
