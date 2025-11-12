export interface Brand {
  id: string;
  name: string;
  address: string;
  bank_account_holder: string;
  bank_account_number: string;
  bank_name: string;
  contact_email: string;
  contact_phone: string;
  logo_url?: string;
  representative_citizen_id: string;
  representative_email: string;
  representative_name: string;
  representative_phone: string;
  representative_role: string;
  tax_number: string;
  has_campaign: boolean;
}

export interface ParentContract {
  id: string;
  contract_number: string;
  title: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface ContractDetail {
  id: string;
  parent_contract_id?: string;
  title: string;
  contract_number: string;
  type: string;
  status: string;
  deposit_amount: number;
  deposit_percent: number;
  is_deposit_paid: boolean;
  brand: Brand;
  representative_name: string;
  representative_role: string;
  representative_phone: string;
  representative_email: string;
  representative_tax_number?: string;
  representative_bank_name?: string;
  representative_bank_account_number?: string;
  representative_bank_account_holder?: string;
  signed_date?: string;
  signed_location?: string;
  start_date: string;
  end_date: string;
  currency: string;
  financial_terms: {
    model: string;
    profit_distribution_cycle: string;
    profit_distribution_date: string;
    profit_split_company_percent: number;
    profit_split_kol_percent: number;
  };
  scope_of_work: {
    deliverables: {
      concepts: {
        content_requirements: string[];
        creative_notes: string;
        description: string;
        hash_tag: string[];
        id: number;
        material_url: string[];
        name: string;
        platform: string;
        product_id: number;
        tagline: string;
      }[];
      products: {
        description: string;
        id: number;
        kpis: {
          metric: string;
          target: string;
        }[];
        material: any;
        name: string;
      }[];
    };
    general_requirements: string[];
  };
  legal_terms: {
    breach_of_contract: {
      items: {
        details: string[];
        title: string;
        compensation_percent?: number;
      }[];
      label: string;
    };
    standard_terms: {
      items: {
        description: string;
        title: string;
      }[];
      label: string;
    };
  };
  contract_file_url?: string;
  proposal_file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ContractParams {
  brand_id?: string;
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
