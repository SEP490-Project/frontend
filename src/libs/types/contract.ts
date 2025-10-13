export interface ContractDetail {
  id: string;
  contract_number: string;
  type: "ADVERTISING" | "AFFILIATE" | "BRAND_AMBASSADOR" | "CO_PRODUCING";
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "TERMINATED";
  signed_date?: string;
  signed_location?: string;
  start_date: string;
  end_date: string;
  brand: {
    id: string;
    name: string;
    contact_email: string;
    contact_phone: string;
    address: string;
  };
  representative_name: string;
  representative_role: string;
  representative_phone: string;
  representative_email: string;
  representative_tax_number?: string;
  representative_bank_name?: string;
  representative_bank_account_number?: string;
  representative_bank_account_holder?: string;
  currency: string;
  financial_terms: {
    total_value: number;
    payment_schedule: string;
    payment_method: string;
  };
  scope_of_work: {
    deliverables: string[];
    requirements: string[];
    responsibilities: string[];
  };
  legal_terms: {
    penalties: string[];
    warranty: string;
    dispute_resolution: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ContractParams {
  brand_id: string;
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}

export interface ContractResponse {
  data: ContractBase[];
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

export interface ContractDetailResponse {
  data: ContractDetail;
  message: string;
  status: string;
  status_code: number;
  success: boolean;
}
export interface ContractBase {
  id: string;
  title: string;
  contract_number: string;
  type: string;
  status: string;
  brand_id: string;
  brand_name: string;
  start_date: string;
  end_date: string;
  signed_date: string;
  created_at: string;
  updated_at: string;
}

export interface AddContract {
  type: "ADVERTISING" | "AFFILIATE" | "BRAND_AMBASSADOR" | "CO_PRODUCING";
  brand_id: string;
  signed_location: string;
  contract_number: string;
  signed_date: string;
  start_date: string;
  end_date: string;
  currency: "VND";
  representative_bank_name?: string;
  representative_bank_account_number?: string;
  representative_bank_account_holder?: string;
  financial_terms: {
    total_value?: number;
    payment_schedule: string;
    payment_method: string;
  };

  scope_of_work: {
    deliverables: string[];
    requirements: string[];
    responsibilities: string[];
  };
  legal_terms: {
    breach_of_contract: {
      label: string;
      items: [
        {
          title: string;
          details?: string[];
          compensation_percent?: number;
        },
      ];
    };
    standard_terms: {
      label: string;
      items: [
        {
          title: string;
          description?: string;
        },
      ];
    };
  };
  created_at: string;
  updated_at: string;
}
