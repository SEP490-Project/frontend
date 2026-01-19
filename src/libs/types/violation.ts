// Contract Violation Types

export type ViolationType = "BRAND" | "KOL";
export type ViolationProofStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";

/* type ViolationResponse struct {
	ID         uuid.UUID          `json:"id"`
	ContractID uuid.UUID          `json:"contract_id"`
	CampaignID *uuid.UUID         `json:"campaign_id,omitempty"`
	Type       enum.ViolationType `json:"type"`
	Reason     string             `json:"reason"`

	// Financial details
	PenaltyAmount       float64 `json:"penalty_amount"`
	RefundAmount        float64 `json:"refund_amount"`
	TotalPaidByBrand    float64 `json:"total_paid_by_brand"`
	CompletedMilestones int     `json:"completed_milestones"`
	TotalMilestones     int     `json:"total_milestones"`

	// Proof handling
	ProofStatus      *enum.ViolationProofStatus `json:"proof_status,omitempty"`
	ProofURL         *string                    `json:"proof_url,omitempty"`
	ProofSubmittedAt *time.Time                 `json:"proof_submitted_at,omitempty"`
	ProofReviewedAt  *time.Time                 `json:"proof_reviewed_at,omitempty"`
	ProofReviewNote  *string                    `json:"proof_review_note,omitempty"`

	// Resolution
	ResolvedAt *time.Time `json:"resolved_at,omitempty"`
	IsResolved bool       `json:"is_resolved"`

	// Related data
	Contract *ContractSummaryResponse `json:"contract,omitempty"`
	Campaign *CampaignSummaryResponse `json:"campaign,omitempty"`

	// Audit
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ContractSummaryResponse struct {
	ID             uuid.UUID `json:"id"`
	ContractNumber string    `json:"contract_number"`
	BrandID        uuid.UUID `json:"brand_id"`
	BrandName      string    `json:"brand_name"`
	TotalValue     float64   `json:"total_value"`
	Status         string    `json:"status"`
}

// CampaignSummaryResponse is a brief campaign summary for nested responses
type CampaignSummaryResponse struct {
	ID     uuid.UUID `json:"id"`
	Name   string    `json:"name"`
	Status string    `json:"status"`
}
*/

export interface ViolationContractSummary {
  id: string;
  contract_number: string;
  brand_id: string;
  brand_name: string;
  total_value: number;
  status: string;
}

export interface ViolationCampaignSummary {
  id: string;
  name: string;
  status: string;
}

export interface ContractViolation {
  id: string;
  contract_id: string;
  campaign_id?: string;
  type: ViolationType;
  reason: string;

  // Financial details
  penalty_amount: number;
  refund_amount: number;
  total_paid_by_brand: number;
  completed_milestones: number;
  total_milestones: number;

  // Proof handling
  proof_status?: ViolationProofStatus;
  proof_url?: string;
  proof_submitted_at?: string;
  proof_reviewed_at?: string;
  proof_review_note?: string;

  // Resolution
  resolved_at?: string;
  is_resolved: boolean;

  // Related data
  contract?: ViolationContractSummary;
  campaign?: ViolationCampaignSummary;

  // Audit
  created_at: string;
  updated_at: string;

  // Additional Frontend fields (optional, derived or used for UI state)
  payment_data?: {
    paymentLinkId?: string;
    orderCode?: number;
    checkoutUrl?: string;
    qrCode?: string;
    bin?: string;
    accountNumber?: string;
    accountName?: string;
    expiredAt?: number;
    amount?: number;
    description?: string;
  };
}

// Request DTOs
export interface ReportViolationRequest {
  reason: string;
}

export interface SubmitProofRequest {
  proof_url: string;
  message: string;
}

export interface CreatePenaltyPaymentRequest {
  violation_id: string;
  return_url?: string;
  cancel_url?: string;
}

export interface ReviewProofRequest {
  action: "APPROVE" | "REJECT";
  reject_reason?: string;
}

export interface ViolationListParams {
  contract_id?: string;
  violation_type?: ViolationType;
  review_status?: ViolationProofStatus;
  page: number;
  limit: number;
  sort_by?: "created_at" | "updated_at" | "total_due_amount";
  sort_order?: "asc" | "desc";
}

// Response Types
export interface ContractViolationResponse {
  data: ContractViolation;
  message: string;
  status: string;
  status_code: number;
  success: boolean;
}

export interface ViolationListItem {
  id: string;
  contract_id: string;
  contract_number: string;
  campaign_id?: string;
  campaign_name?: string;
  brand_id: string;
  brand_name: string;
  type: ViolationType;
  reason: string;
  penalty_amount: number;
  refund_amount: number;
  proof_status?: ViolationProofStatus;
  is_resolved: boolean;
  created_at: string;
}

export interface ViolationListResponse {
  data: ViolationListItem[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  status: string;
  status_code: number;
  success: boolean;
}

export interface CreatePenaltyPaymentResponse {
  data: {
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
  };
  message: string;
  status: string;
  status_code: number;
  success: boolean;
}

// Contract violation status helper constants
export const BRAND_VIOLATION_STATUSES = [
  "BRAND_VIOLATED",
  "BRAND_PENALTY_PENDING",
  "BRAND_PENALTY_PAID",
  "TERMINATED",
] as const;

export const KOL_VIOLATION_STATUSES = [
  "KOL_VIOLATED",
  "KOL_REFUND_PENDING",
  "KOL_PROOF_SUBMITTED",
  "KOL_PROOF_REJECTED",
  "KOL_REFUND_APPROVED",
  "TERMINATED",
] as const;

export const ALL_VIOLATION_STATUSES = [
  ...BRAND_VIOLATION_STATUSES,
  ...KOL_VIOLATION_STATUSES,
] as const;

export type ContractViolationStatus = (typeof ALL_VIOLATION_STATUSES)[number];

// Helper functions
export function isViolationStatus(status: string): status is ContractViolationStatus {
  return ALL_VIOLATION_STATUSES.includes(status as ContractViolationStatus);
}

export function isBrandViolationStatus(status: string): boolean {
  return BRAND_VIOLATION_STATUSES.includes(status as (typeof BRAND_VIOLATION_STATUSES)[number]);
}

export function isKOLViolationStatus(status: string): boolean {
  return KOL_VIOLATION_STATUSES.includes(status as (typeof KOL_VIOLATION_STATUSES)[number]);
}

export function getViolationTypeFromStatus(status: string): ViolationType | null {
  if (isBrandViolationStatus(status)) return "BRAND";
  if (isKOLViolationStatus(status)) return "KOL";
  return null;
}

// Status display helpers
export const VIOLATION_STATUS_LABELS: Record<ContractViolationStatus, string> = {
  BRAND_VIOLATED: "Brand Violated",
  BRAND_PENALTY_PENDING: "Penalty Pending",
  BRAND_PENALTY_PAID: "Penalty Paid",
  KOL_VIOLATED: "KOL Violated",
  KOL_REFUND_PENDING: "Refund Pending",
  KOL_PROOF_SUBMITTED: "Proof Submitted",
  KOL_PROOF_REJECTED: "Proof Rejected",
  KOL_REFUND_APPROVED: "Refund Approved",
  TERMINATED: "Terminated",
};

export const VIOLATION_PROOF_STATUS_LABELS: Record<ViolationProofStatus, string> = {
  PENDING: "Pending",
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const VIOLATION_TYPE_STYLE = (type: ViolationType) => {
  switch (type) {
    case "BRAND":
      return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100";
    case "KOL":
      return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const PROOF_STATUS_STYLE = (status: ViolationProofStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "SUBMITTED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
