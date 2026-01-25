import api from "@/libs/api";
import type {
  ContractPaymentParams,
  CreatePaymentParams,
  SubmitRefundProofRequest,
  ReviewRefundProofRequest,
} from "@/libs/types/contract-payments";

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

  // CO_PRODUCING refund workflow APIs
  getRefundPayments: () => {
    return api.get("/contract_payments/refunds");
  },

  getPendingRefundProofs: () => {
    return api.get("/contract_payments/refunds/pending");
  },

  submitRefundProof: (contractPaymentId: string, data: SubmitRefundProofRequest) => {
    return api.post(`/contract_payments/${contractPaymentId}/refund-proof`, data);
  },

  reviewRefundProof: (contractPaymentId: string, data: ReviewRefundProofRequest) => {
    return api.post(`/contract_payments/${contractPaymentId}/refund-proof/review`, data);
  },
};
