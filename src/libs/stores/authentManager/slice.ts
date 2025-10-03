import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./thunk";

interface stateType {
  loading: boolean;
}

const initialState: stateType = {
  loading: false,
};

export const manageAuthenSlice = createSlice({
  name: "manageAuthen",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageAuthenReducer, actions: manageAuthenActions } = manageAuthenSlice;
