import { createSlice } from "@reduxjs/toolkit";
import type { ConceptData } from "@/libs/types/concept";
import { createConceptThunk, getAllConceptsThunk } from "./thunk";

interface ConceptManagerState {
  concepts: ConceptData[];
  loading: boolean;
  error: string | null;
  currentConcept: ConceptData | null;
}

const initialState: ConceptManagerState = {
  concepts: [],
  loading: false,
  error: null,
  currentConcept: null,
};

const conceptManagerSlice = createSlice({
  name: "conceptManager",
  initialState,
  reducers: {
    setCurrentConcept: (state, action) => {
      state.currentConcept = action.payload;
    },
    clearCurrentConcept: (state) => {
      state.currentConcept = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all concepts
      .addCase(getAllConceptsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllConceptsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.concepts = action.payload;
      })
      .addCase(getAllConceptsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch concepts";
      })
      // Create concept
      .addCase(createConceptThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConceptThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConcept = action.payload;
        state.concepts.push(action.payload);
      })
      .addCase(createConceptThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create concept";
      });
  },
});

export const { setCurrentConcept, clearCurrentConcept } = conceptManagerSlice.actions;
export const conceptManagerReducer = conceptManagerSlice.reducer;
