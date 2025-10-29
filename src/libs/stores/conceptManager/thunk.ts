import { createAsyncThunk } from "@reduxjs/toolkit";
import manageConcept from "@/libs/services/manageConcept";
import type { CreateConceptPayload, ConceptData, ConceptResponse } from "@/libs/types/concept";

export const getAllConceptsThunk = createAsyncThunk(
  "conceptManager/getAllConcepts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageConcept.getAllConcepts();
      const data = response.data as ConceptResponse<ConceptData[]>;
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch concepts");
    }
  },
);

export const createConceptThunk = createAsyncThunk(
  "conceptManager/createConcept",
  async (payload: CreateConceptPayload, { rejectWithValue }) => {
    try {
      const response = await manageConcept.createConcept(payload);
      const data = response.data as ConceptResponse<ConceptData>;
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create concept");
    }
  },
);
