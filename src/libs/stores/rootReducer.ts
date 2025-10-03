import { combineReducers } from "@reduxjs/toolkit";
import { manageAuthenReducer } from "./authentManager/slice";

export const rootReducer = combineReducers({
  manageAuthen: manageAuthenReducer,
});
