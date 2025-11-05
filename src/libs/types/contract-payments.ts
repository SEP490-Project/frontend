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

export interface ContractPayment {
  id: string;
  contract_id: string;
  contract_title: string;
  contract_number: string;
  brand_id: string;
  brand_name: string;
  installment_percentage: number;
  amount: number;
  status: string;
  due_date: string;
  payment_method: string;
  note: string;
  created_at: string;
  updated_at: string;
}
