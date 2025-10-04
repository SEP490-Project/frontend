import { combineReducers } from "@reduxjs/toolkit";
import { manageAuthenReducer } from "./authentManager/slice";
import { manageBrandReducer } from "./brandManager/slice";

export const rootReducer = combineReducers({
  manageAuthen: manageAuthenReducer,
  manageBrand: manageBrandReducer,
});
