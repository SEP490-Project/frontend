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
  reference_info?: ReferenceInfo;
  amount: string;
  method: string;
  status: string;
  transaction_date: string;
  gateway_ref: string;
  gateway_id: string;
  updated_at: string;
  payer_id?: string;
  received_by_id?: string;
}

export interface ReferenceInfo {
  id: string;
  contract_id?: string;
  contract_number?: string;
  is_deposit?: boolean;
  user_info?: UserInfo;
  brand_info?: BrandInfo;
  bank_info?: BankInfo;
  order_items?: OrderItem[];
  product_variant_info?: ProductVariantInfo;
}

export interface UserInfo {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
}

export interface BrandInfo {
  id: string;
  user_id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  representative_name: string;
  representative_email: string;
  representative_phone: string;
}
export interface BankInfo {
  bank_account: string;
  bank_name: string;
  bank_account_holder: string;
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product_image_url?: string;
}

export interface ProductVariantInfo {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export type TransactionReferenceType =
  | "ORDER"
  | "CONTRACT_PAYMENT"
  | "PREORDER"
  | "CONTRACT_VIOLATION"
  | "KOL_VIOLATION_REFUNDING";

export interface TransactionParams {
  reference_type?: TransactionReferenceType | string;
  reference_types?: string;
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
