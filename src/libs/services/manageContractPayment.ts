import api from "@/libs/api";
import type { ContractPaymentParams } from "@/libs/types/contract-payments";

export const manageContractPayment = {
  getContractPaymentBrand: (params?: ContractPaymentParams) => {
    return api.get("/contract_payments/profile", { params });
  },

  getContractPayment: (params?: ContractPaymentParams) => {
    return api.get("/contract_payments", { params });
  },

  getContractPaymentDetail: (req: string) => {
    return api.get(`/contract_payments/${req}`);
  },
};
