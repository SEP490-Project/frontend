import { manageAttribute } from "@/libs/services/manageAttribute";
import type { GetVariantAttributesParams } from "@/libs/types/variant-attribute";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getAllVariantAttributesThunk = createAsyncThunk(
  "attributeManager/getAllVariantAttributes",
  async (params: GetVariantAttributesParams, thunkAPI) => {
    try {
      const response = await manageAttribute.getAllVariantAttributes(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export { getAllVariantAttributesThunk };
