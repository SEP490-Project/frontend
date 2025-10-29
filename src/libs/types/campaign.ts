export interface Milestone {
  id: string;
  description: string;
  due_date: string;
  completed_at?: string | null;
  status: string;
  completion_percentage: number;
  number_of_tasks: number;
  behind_schedule: boolean;
}

export interface CampaignData {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  type: string;
  start_date: string;
  end_date: string;
  contract_id: string;
  contract_number: string;
  contract_title: string;
  created_at: string;
  updated_at: string;
  milestones?: Milestone[];
  number_of_tasks?: number;
  percentage_completed?: number;
}

export type CampaignBase = CampaignData;

export interface CampaignParams {
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

export interface SingleCampaignResponse {
  data: CampaignData;
  message: string;
  status: string;
  status_code: number;
  success: boolean;
}
