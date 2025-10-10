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
