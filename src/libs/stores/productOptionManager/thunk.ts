import manageProductOptions from "@/libs/services/manageProductOptions";
import type {
  ProductOptionResponse,
  ProductOptionsByTypeResponse,
  ProductOptionFilterParams,
  CreateProductOptionPayload,
  UpdateProductOptionPayload,
  ProductOptionType,
} from "@/libs/types/productOption";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Get all product options
export const getAllProductOptionsThunk = createAsyncThunk(
  "productOptions/getAll",
  async (params: ProductOptionFilterParams | undefined, { rejectWithValue }) => {
    try {
      const response = await manageProductOptions.getAll(params);
      return response.data as ProductOptionResponse;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Failed to fetch product options",
      );
    }
  },
);

// Get product options by type
export const getProductOptionsByTypeThunk = createAsyncThunk(
  "productOptions/getByType",
  async (
    { type, activeOnly = true }: { type: ProductOptionType; activeOnly?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageProductOptions.getByType(type, activeOnly);
      return { type, data: response.data as ProductOptionsByTypeResponse };
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || `Failed to fetch ${type} options`,
      );
    }
  },
);

// Get product option by ID
export const getProductOptionByIdThunk = createAsyncThunk(
  "productOptions/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageProductOptions.getById(id);
      return response.data as ProductOptionResponse;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Failed to fetch product option",
      );
    }
  },
);

// Create product option
export const createProductOptionThunk = createAsyncThunk(
  "productOptions/create",
  async (data: CreateProductOptionPayload, { rejectWithValue }) => {
    try {
      const response = await manageProductOptions.create(data);
      return response.data as ProductOptionResponse;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Failed to create product option",
      );
    }
  },
);

// Update product option
export const updateProductOptionThunk = createAsyncThunk(
  "productOptions/update",
  async ({ id, data }: { id: string; data: UpdateProductOptionPayload }, { rejectWithValue }) => {
    try {
      const response = await manageProductOptions.update(id, data);
      return response.data as ProductOptionResponse;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Failed to update product option",
      );
    }
  },
);

// Delete product option
export const deleteProductOptionThunk = createAsyncThunk(
  "productOptions/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageProductOptions.delete(id);
      return response.data as ProductOptionResponse;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Failed to delete product option",
      );
    }
  },
);

// Fetch all option types at once for forms
export const fetchAllProductOptionTypesThunk = createAsyncThunk(
  "productOptions/fetchAllTypes",
  async (_, { rejectWithValue }) => {
    try {
      const [capacityUnits, containerTypes, dispenserTypes, attributeUnits] = await Promise.all([
        manageProductOptions.getByType("CAPACITY_UNIT", true),
        manageProductOptions.getByType("CONTAINER_TYPE", true),
        manageProductOptions.getByType("DISPENSER_TYPE", true),
        manageProductOptions.getByType("ATTRIBUTE_UNIT", true),
      ]);
      return {
        capacity_unit: (capacityUnits.data as ProductOptionsByTypeResponse).data,
        container_type: (containerTypes.data as ProductOptionsByTypeResponse).data,
        dispenser_type: (dispenserTypes.data as ProductOptionsByTypeResponse).data,
        attribute_unit: (attributeUnits.data as ProductOptionsByTypeResponse).data,
      };
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Failed to fetch product option types",
      );
    }
  },
);
