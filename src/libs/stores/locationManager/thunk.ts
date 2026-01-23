import manageLocation from "@/libs/services/manageLocation";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getProvincesThunk = createAsyncThunk(
  "locationManager/getProvinces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageLocation.getProvincesByGHN();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch provinces");
    }
  },
);

const getDistrictsThunk = createAsyncThunk(
  "locationManager/getDistricts",
  async (provinceId: number, { rejectWithValue }) => {
    try {
      const response = await manageLocation.getDistrictsByGHNFromProvince(provinceId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch districts");
    }
  },
);

const getWardsThunk = createAsyncThunk(
  "locationManager/getWards",
  async (districtId: number, { rejectWithValue }) => {
    try {
      const response = await manageLocation.getWardsByGHNFromDistrict(districtId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wards");
    }
  },
);

export { getDistrictsThunk, getProvincesThunk, getWardsThunk };
