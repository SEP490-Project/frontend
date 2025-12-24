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
}
