export interface Contract {
  id: string;
  brand_id: string;
  brand_name: string;
  contract_number: string;
  title: string;
  type: "ADVERTISING" | "AFFILIATE" | "BRAND_AMBASSADOR" | "CO_PRODUCING";
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "TERMINATED";
  signed_date?: string;
  start_date: string;
  end_date: string;
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
  data: Contract[];
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
