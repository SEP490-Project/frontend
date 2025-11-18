export interface TransactionResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: TransactionData[];
  pagination: Pagination;
}

export interface TransactionData {
  id: string;
  reference_id: string;
  reference_type: string;
  amount: string;
  method: string;
  status: string;
  transaction_date: string;
  gateway_ref: string;
  gateway_id: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface TransactionParams {
  reference_type?: "ORDER" | "CONTRACT_PAYMENT" | "PREORDER";
  reference_id?: string;
  payer_id?: string;
  status?: "PENDING" | "COMPLETED" | "CANCELLED" | "EXPRIRED";
  method?: "BANK_TRANSFER" | "CREDIT_CARD" | "E_WALLET" | "PAYOS";
  transaction_from_date?: string;
  transaction_to_date?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
