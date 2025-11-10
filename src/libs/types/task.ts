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
  campaign_id: string;
  contract_id: string;
  milestone_id: string;
  created_by_id?: string;
  created_by_name?: string;
  updated_by_id?: string;
  updated_by_name?: string;
  content_ids?: string[];
  product_ids?: string[];
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
