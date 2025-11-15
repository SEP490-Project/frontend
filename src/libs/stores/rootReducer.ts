import { combineReducers } from "@reduxjs/toolkit";
import { manageAuthenReducer } from "./authentManager/slice";
import { manageBrandReducer } from "./brandManager/slice";
import { manageContractReducer } from "./contractManager/slice";
import { manageContentReducer } from "./contentManager/slice";
import { manageUserReducer, userProfileReducer } from "./userManager/slice";
import { manageGoongReducer } from "./goongManager/slice";
import { manageCampaignReducer } from "./campaignManager/slice";
import { productManagerReducer } from "./productManager/slice";
import { manageBankReducer } from "./bankManager/slice";
import { manageFileReducer } from "./fileManager/slice";
import { manageConfigReducer } from "./configManager/slice";
import { categoryManagerReducer } from "./categoryManager/slice";
import { attributeManagerReducer } from "./attributeManager/slice";
import { conceptManagerReducer } from "./conceptManager/slice";
import { manageTagReducer } from "./tagManager/slice";
import { manageChannelReducer } from "./channelManager/slice";
import { manageTaskReducer } from "./taskManager/slice";
import { manageContractPaymentReducer } from "./contractPaymentManager/slice";
import { manageContentMarketingReducer } from "./contentMarketingManager/slice";
import { managePaymentReducer } from "./paymentManager/slice";
import { stateManagerReducer } from "./stateManager/slice";
import { orderManagerReducer } from "./orderManager/slice";
import { transactionManagerReducer } from "./transactionManager/slice";
import { managePostedContentReducer } from "./contentPostedManager/slice";

export const rootReducer = combineReducers({
  manageAuthen: manageAuthenReducer,
  manageBrand: manageBrandReducer,
  manageContract: manageContractReducer,
  manageContent: manageContentReducer,
  manageUser: manageUserReducer,
  manageGoong: manageGoongReducer,
  manageCampaign: manageCampaignReducer,
  manageProduct: productManagerReducer,
  manageUserProfile: userProfileReducer,
  manageBank: manageBankReducer,
  manageFile: manageFileReducer,
  manageConfig: manageConfigReducer,
  manageCategory: categoryManagerReducer,
  manageAttribute: attributeManagerReducer,
  manageConcept: conceptManagerReducer,
  manageTag: manageTagReducer,
  manageChannel: manageChannelReducer,
  manageTask: manageTaskReducer,
  manageContractPayment: manageContractPaymentReducer,
  manageContentMarketing: manageContentMarketingReducer,
  managePayment: managePaymentReducer,
  manageState: stateManagerReducer,
  manageOrder: orderManagerReducer,
  manageTransaction: transactionManagerReducer,
  managePostedContent: managePostedContentReducer,
});
