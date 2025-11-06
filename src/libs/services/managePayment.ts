import api from "@/libs/api";
import type { PaymentProfileParams, PaymentLinkRequest } from "@/libs/types/payment";

export const managePayment = {
  // Get contract payments for the authenticated brand partner
  getContractPaymentsProfile: (params?: PaymentProfileParams) =>
    api.get("/contract_payments/profile", { params }),

  // Get a contract payment by its ID
  getContractPaymentById: (contractPaymentId: string) =>
    api.get(`/contract_payments/${contractPaymentId}`),

  // Generate PayOS payment link for contract payment
  generatePaymentLink: (contractPaymentId: string, req: PaymentLinkRequest) =>
    api.post(`/contract_payments/${contractPaymentId}/payment-link`, req),
};
