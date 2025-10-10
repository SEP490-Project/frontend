import { combineReducers } from "@reduxjs/toolkit";
import { manageAuthenReducer } from "./authentManager/slice";
import { manageBrandReducer } from "./brandManager/slice";
import { manageContractReducer } from "./contractManager/slice";
import { manageContentReducer } from "./contentManager/slice";
import { manageUserReducer } from "./userManager/slice";
import { manageGoongReducer } from "./goongManager/slice";
import { manageCampaignReducer } from "./campaignManager/slice";

export const rootReducer = combineReducers({
  manageAuthen: manageAuthenReducer,
  manageBrand: manageBrandReducer,
  manageContract: manageContractReducer,
  manageContent: manageContentReducer,
  manageUser: manageUserReducer,
  manageGoong: manageGoongReducer,
  manageCampaign: manageCampaignReducer,
});
