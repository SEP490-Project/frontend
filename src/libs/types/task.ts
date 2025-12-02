export interface Task {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: {
    details: string;
  };
  deadline: string;
  created_at: string;
  updated_at: string;
  assigned_to_id: string;
  assigned_to_name: string;
  assigned_to_role: string;
  campaign_name: string;
  campaign_id: string;
  contract_id: string;
  milestone_id: string;
  milestone_details: MilestoneDetails;
  campaign_details: CampaignDetails;
  created_by_id?: string;
  created_by_name?: string;
  updated_by_id?: string;
  updated_by_name?: string;
  content_ids?: string[];
  product_ids?: string[];
  child_status?: string;
}

interface MilestoneDetails {
  id: string;
  description: string;
  due_date: string;
  completed_at: string;
  completion_percentage: number;
  status: string;
  behind_schedule: boolean;
}

interface CampaignDetails {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  type: string;
}

export interface TaskResponse {
  data: Task[];
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

export interface TaskContractData {
  contract: {
    id: string;
    clientName: string;
    contractValue: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  campaign: {
    name: string;
    objective: string;
    budget: string;
    timeline: string;
    targetAudience: string;
  };
  milestones: {
    id: number;
    name: string;
    status: "completed" | "in-progress" | "pending";
    dueDate: string;
  }[];
}

export interface TaskListParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  campaign?: string;
  assignee?: string;
  priority?: string;
  date_from?: string;
  date_to?: string;
}

export interface SingleTaskResponse {
  data: Task;
  message: string;
  status: string;
  status_code: number;
  success: boolean;
}

export interface TaskListMarketing {
  id: string;
  name: string;
  deadline: string;
  type: string;
  status: string;
  assigned_to_id: string;
  assigned_to_name: string;
  assigned_to_role: string;
  created_at: string;
  updated_at: string;
  milestone_id: string;
  campaign_id: string;
  campaign_name: string;
  contract_id: string;
}

export interface TaskListMarketingDetail {
  id: string;
  name: string;
  description: {
    description: string;
    material_url: string[];
  };
  deadline: string;
  type: string;
  status: string;
  assigned_to_id: string;
  assigned_to_name: string;
  assigned_to_role: string;
  created_at: string;
  created_by_id: string;
  created_by_name: string;
  updated_at: string;
  updated_by_id: string;
  updated_by_name: string;
  milestone_id: string;
  milestone_details: {
    id: string;
    description: string;
    due_date: string;
    completed_at: string;
    completion_percentage: number;
    status: string;
    behind_schedule: boolean;
  };
  campaign_id: string;
  campaign_details: {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    type: string;
  };
  contract_id: string;
}
