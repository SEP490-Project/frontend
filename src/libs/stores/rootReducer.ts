import { combineReducers } from "@reduxjs/toolkit";
import { manageAuthenReducer } from "./authentManager/slice";
import { manageBrandReducer } from "./brandManager/slice";
import { manageContractReducer } from "./contractManager/slice";

export const rootReducer = combineReducers({
  manageAuthen: manageAuthenReducer,
  manageBrand: manageBrandReducer,
  manageContract: manageContractReducer,
});
