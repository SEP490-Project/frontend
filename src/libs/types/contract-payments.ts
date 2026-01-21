export interface ContractPaymentParams {
  brand_id?: string;
  contract_id?: string;
  status?: string;
  due_date_from?: string;
  due_date_to?: string;
  payment_method?: string;
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: string;
}

export interface CreatePaymentParams {
  contract_payment_id: string;
  return_url?: string;
  cancel_url?: string;
}

export interface PaymentLink {
  accountName: string;
  accountNumber: string;
  amount: number;
  bin: string;
  checkoutUrl: string;
  currency: string;
  description: string;
  expiredAt: number;
  orderCode: number;
  paymentLinkId: string;
  qrCode: string;
  status: string;
}

// Breakdown types for AFFILIATE contracts
export interface LevelPaymentBreakdown {
  level: number;
  clicks_in_tier: number;
  multiplier: number;
  rate_per_click: number;
  tier_payment: number;
}

export interface AffiliateBreakdown {
  contract_id: string;
  period_start: string;
  period_end: string;
  calculated_at: string;
  total_clicks: number;
  gross_payment: number;
  tax_amount: number;
  net_payment: number;
  breakdown: LevelPaymentBreakdown[];
}

// Breakdown types for CO_PRODUCING contracts
export interface LimitedProductRevenueBreakdown {
  preorder_revenue: number;
  order_revenue: number;
  total_revenue: number;
}

export interface CoProducingBreakdown {
  contract_id: string;
  period_start: string;
  period_end: string;
  calculated_at: string;
  total_revenue: number;
  company_percent: number;
  brand_percent: number;
  company_share: number;
  brand_share: number;
  revenue_breakdown: LimitedProductRevenueBreakdown;
}

export interface ContractPayment {
  id: string;
  contract_id: string;
  contract_title: string;
  contract_number: string;
  contract_type?: string;
  brand_id: string;
  brand_name: string;
  installment_percentage: number;
  amount: number;
  base_amount?: number;
  performance_amount?: number;
  breakdown?: AffiliateBreakdown | CoProducingBreakdown;
  status: string;
  due_date: string;
  payment_method: string;
  note: string;
  created_at: string;
  updated_at: string;
  is_deposit?: boolean;
  pay_now?: boolean;
  // Refund workflow fields (for CO_PRODUCING contracts)
  refund_amount?: number;
  refund_proof_url?: string;
  refund_proof_note?: string;
  refund_submitted_at?: string;
  refund_reviewed_at?: string;
  refund_reject_reason?: string;
  refund_attempts?: number;
  can_generate_payment_link?: boolean;
  // Brand bank info (for refund proof submission)
  brand_bank_name?: string;
  brand_bank_account_number?: string;
  brand_bank_account_holder?: string;
}

// CO_PRODUCING Refund Status Types
export type RefundPaymentStatus =
  | "KOL_PENDING"
  | "KOL_PROOF_SUBMITTED"
  | "KOL_PROOF_REJECTED"
  | "KOL_REFUND_APPROVED";

export const REFUND_STATUS_LABELS: Record<RefundPaymentStatus, string> = {
  KOL_PENDING: "Awaiting Refund Proof",
  KOL_PROOF_SUBMITTED: "Proof Submitted",
  KOL_PROOF_REJECTED: "Proof Rejected",
  KOL_REFUND_APPROVED: "Refund Approved",
};

export const REFUND_STATUS_COLORS: Record<RefundPaymentStatus, string> = {
  KOL_PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  KOL_PROOF_SUBMITTED: "bg-blue-100 text-blue-800 border-blue-200",
  KOL_PROOF_REJECTED: "bg-red-100 text-red-800 border-red-200",
  KOL_REFUND_APPROVED: "bg-green-100 text-green-800 border-green-200",
};

// Request types for refund workflow
export interface SubmitRefundProofRequest {
  refund_proof_url: string;
  refund_proof_note?: string;
}

export interface ReviewRefundProofRequest {
  approved: boolean;
  reject_reason?: string;
}
