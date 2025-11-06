export interface ContractPayment {
  id: string;
  contract_id: string;
  payment_number: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  due_date: string;
  paid_date?: string;
  description?: string;
  payment_method?: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ContractPaymentProfile {
  total_payments: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  currency: string;
  payments: ContractPayment[];
}

export interface ContractPaymentDetail extends ContractPayment {
  contract: {
    id: string;
    title: string;
    contract_number: string;
    brand_name: string;
  };
  payment_link?: string;
}

export interface PaymentLinkRequest {
  amount?: number;
  description?: string;
  return_url?: string;
  cancel_url?: string;
}

export interface PaymentLinkResponse {
  payment_link: string;
  payment_id: string;
  expires_at: string;
}

export interface PaymentProfileParams {
  status?: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
  status_code: number;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
