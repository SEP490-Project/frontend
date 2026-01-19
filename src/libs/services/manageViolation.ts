import api from "@/libs/api";
import type {
  ReportViolationRequest,
  SubmitProofRequest,
  ReviewProofRequest,
  ViolationListParams,
  ContractViolationResponse,
  ViolationListResponse,
  CreatePenaltyPaymentResponse,
  CreatePenaltyPaymentRequest,
} from "@/libs/types/violation";

export const manageViolation = {
  /**
   * Get violation record for a specific contract
   */
  getByContractId: (contractId: string): Promise<{ data: ContractViolationResponse }> =>
    api.get(`/contracts/${contractId}/violation`),

  /**
   * Report brand violation (Marketing staff only)
   */
  reportBrandViolation: (
    contractId: string,
    data: ReportViolationRequest,
  ): Promise<{ data: ContractViolationResponse }> =>
    api.post(`/contracts/${contractId}/report-brand-violation`, data),

  /**
   * Report KOL violation (Brand only)
   */
  reportKOLViolation: (
    contractId: string,
    data: ReportViolationRequest,
  ): Promise<{ data: ContractViolationResponse }> =>
    api.post(`/contracts/${contractId}/report-kol-violation`, data),

  /**
   * Create penalty payment link via PayOS (Brand only)
   */
  createPenaltyPayment: (
    contractId: string,
    data: CreatePenaltyPaymentRequest,
  ): Promise<{ data: CreatePenaltyPaymentResponse }> =>
    api.post(`/contracts/${contractId}/violation/create-penalty-payment`, data),

  /**
   * Submit refund proof (Marketing staff only)
   */
  submitProof: (
    contractId: string,
    data: SubmitProofRequest,
  ): Promise<{ data: ContractViolationResponse }> =>
    api.post(`/contracts/${contractId}/violation/submit-proof`, data),

  /**
   * Review refund proof (Brand only)
   */
  reviewProof: (
    contractId: string,
    data: ReviewProofRequest,
  ): Promise<{ data: ContractViolationResponse }> =>
    api.post(`/contracts/${contractId}/violation/review-proof`, data),

  /**
   * List all violations with filtering (Marketing/Admin only)
   */
  list: (params: ViolationListParams): Promise<{ data: ViolationListResponse }> =>
    api.get("/violations", { params }),
};
