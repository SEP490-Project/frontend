import api from "@/libs/api";
import type { ContractPaymentParams, CreatePaymentParams } from "@/libs/types/contract-payments";

export const manageContractPayment = {
  getContractPaymentBrand: (params?: ContractPaymentParams) => {
    return api.get("/contract_payments/profile", { params });
  },

  getContractPayment: (params?: ContractPaymentParams) => {
    return api.get("/contract_payments", { params });
  },

  createPaymentLink: (req: CreatePaymentParams) => {
    return api.post(`/contract_payments/${req.contract_payment_id}/payment-link`, null, {
      params: {
        return_url: req.return_url,
        cancel_url: req.cancel_url,
      },
    });
  },

  getContractPaymentDetail: (req: string) => {
    return api.get(`/contract_payments/${req}`);
  },
};
