export interface CampaignData {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  type: string;
  start_date: string;
  end_date: string;
  budget_actual: number;
  budget_projected: number;
  contract_id: string;
  contract_number: string;
  contract_title: string;
  created_at: string;
  updated_at: string;
}

export type CampaignBase = CampaignData;

export interface CampaignParams {
  brand_id?: string;
  page: number;
  limit: number;
  status?: string;
  type?: string;
}

export interface CampaignResponse {
  data: CampaignData[];
  message: string;
  pagination: {
    has_next: boolean;
    has_prev: boolean;
    limit: number;
    page: number;
    total: number;
    total_pages: number;
  };
  status: string;
  status_code: number;
  success: boolean;
}
