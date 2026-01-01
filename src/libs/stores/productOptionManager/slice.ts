import { createSlice } from "@reduxjs/toolkit";
import type { ProductOption } from "@/libs/types/productOption";
import type { Pagination } from "@/libs/types/common";
import {
  getAllProductOptionsThunk,
  getProductOptionsByTypeThunk,
  getProductOptionByIdThunk,
  createProductOptionThunk,
  updateProductOptionThunk,
  deleteProductOptionThunk,
  fetchAllProductOptionTypesThunk,
} from "./thunk";

interface ProductOptionState {
  // All options (for admin list view)
  options: ProductOption[];
  pagination: Pagination | null;

  // Options grouped by type (for form dropdowns)
  capacityUnits: ProductOption[];
  containerTypes: ProductOption[];
  dispenserTypes: ProductOption[];
  attributeUnits: ProductOption[];

  // Currently selected option (for edit form)
  selectedOption: ProductOption | null;

  // Loading states
  loading: boolean;
  loadingByType: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  // Error state
  error: string | null;
}

const initialState: ProductOptionState = {
  options: [],
  pagination: null,
  capacityUnits: [],
  containerTypes: [],
  dispenserTypes: [],
  attributeUnits: [],
  selectedOption: null,
  loading: false,
  loadingByType: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
};

const ProductOptionSlice = createSlice({
  name: "productOptionManager",
  initialState,
  reducers: {
    clearSelectedOption: (state) => {
      state.selectedOption = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearOptions: (state) => {
      state.options = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    // Get all options
    builder
      .addCase(getAllProductOptionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProductOptionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data;
        state.options = Array.isArray(data) ? data : data ? [data] : [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getAllProductOptionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get options by type
    builder
      .addCase(getProductOptionsByTypeThunk.pending, (state) => {
        state.loadingByType = true;
        state.error = null;
      })
      .addCase(getProductOptionsByTypeThunk.fulfilled, (state, action) => {
        state.loadingByType = false;
        const { type, data } = action.payload;
        const options = data.data || [];
        switch (type) {
          case "CAPACITY_UNIT":
            state.capacityUnits = options;
            break;
          case "CONTAINER_TYPE":
            state.containerTypes = options;
            break;
          case "DISPENSER_TYPE":
            state.dispenserTypes = options;
            break;
          case "ATTRIBUTE_UNIT":
            state.attributeUnits = options;
            break;
        }
      })
      .addCase(getProductOptionsByTypeThunk.rejected, (state, action) => {
        state.loadingByType = false;
        state.error = action.payload as string;
      });

    // Get option by ID
    builder
      .addCase(getProductOptionByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductOptionByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data;
        state.selectedOption = Array.isArray(data) ? null : data;
      })
      .addCase(getProductOptionByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create option
    builder
      .addCase(createProductOptionThunk.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createProductOptionThunk.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createProductOptionThunk.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      });

    // Update option
    builder
      .addCase(updateProductOptionThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProductOptionThunk.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateProductOptionThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload as string;
      });

    // Delete option
    builder
      .addCase(deleteProductOptionThunk.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteProductOptionThunk.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteProductOptionThunk.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });

    // Fetch all types at once
    builder
      .addCase(fetchAllProductOptionTypesThunk.pending, (state) => {
        state.loadingByType = true;
        state.error = null;
      })
      .addCase(fetchAllProductOptionTypesThunk.fulfilled, (state, action) => {
        state.loadingByType = false;
        state.capacityUnits = action.payload.capacity_unit;
        state.containerTypes = action.payload.container_type;
        state.dispenserTypes = action.payload.dispenser_type;
        state.attributeUnits = action.payload.attribute_unit;
      })
      .addCase(fetchAllProductOptionTypesThunk.rejected, (state, action) => {
        state.loadingByType = false;
        state.error = action.payload as string;
      });
  },
});

export const productOptionManagerReducer = ProductOptionSlice.reducer;
export const productOptionManagerActions = ProductOptionSlice.actions;
