export interface SaleAnalyticDetailResponse {
  data: SaleAnalyticDetailData[];
  message: string;
  pagination: Pagination;
  revenue_type: string;
  status: string;
  status_code: number;
  success: boolean;
  total_revenue: number;
}

export interface SaleAnalyticDetailData {
  id: string;
  source: string;
  order_type: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total_amount: number;
  shipping_fee: number;
  net_amount: number;
  kol_percent: number;
  created_at: string;
  payment_transaction: PaymentTransaction;
}

export interface PaymentTransaction {
  id: string;
  reference_id: string;
  reference_type: string;
  amount: number;
  method: string;
  status: string;
  transaction_date: string;
  gateway_ref: string;
  gateway_id: string;
  updated_at: string;
  payer_id: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SaleAnalyticDetailParams {
  page?: number;
  limit?: number;
  from_date?: string;
  to_date?: string;
  search?: string;
  sort_by?: "total_amount" | "created_at";
  sort_order?: "asc" | "desc";
}
