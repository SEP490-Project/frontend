export interface Milestone {
  id: string;
  description: string;
  due_date: string;
  completed_at?: string | null;
  status: string;
  percentage_completed: number;
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
  metrics_comparison?: MetricsComparison;
}

export interface MetricItem {
  metric: string;
  target: string;
}

export interface MetricsItem {
  item_id: number;
  item_name: string;
  expected_metrics: MetricItem[];
  realistic_metrics: Record<string, number>;
}

export interface MetricItem {
  metric: string;
  target: string;
}

export interface MetricsItem {
  item_id: number;
  item_name: string;
  expected_metrics: MetricItem[];
  realistic_metrics: Record<string, number>;
}

export interface MetricsComparison {
  expected_metrics: Record<string, number>;
  realistic_metrics: Record<string, number>;
  items: MetricsItem[];
}

export type CampaignBase = CampaignData;

export interface CampaignParams {
  page: number;
  limit: number;
  status?: string;
  type?: string;
  keyword?: string;
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

export interface CampaignRequest {
  contract_id?: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  type: string;
  milestones: {
    description: string;
    due_date: string;
    tasks: {
      deadline: string;
      name: string;
      type: string;
      description: {
        // Common fields
        kpi_goals?: { metric: string; target: string }[] | null;
        material_urls?: string[];

        // Advertising/Affiliate fields
        advertised_item_id?: number;
        product_name?: string;
        platform?: string;
        tagline?: string;
        creative_notes?: string;
        hashtags?: string[];
        is_affiliate_content?: boolean;
        tracking_link?: string;

        // Brand Ambassador (Event) fields
        event_id?: number;
        event_name?: string;
        event_date?: string;
        event_duration?: string;
        location?: string;
        activities?: string[];
        representation_rules?: string[];

        // Co-Producing (Product) fields
        is_product_creation_task?: boolean;
        product_id?: number;
        product_description?: string;
        subtasks?: string[];
        materials?: string[];
      };
    }[];
  }[];
}

export interface CampaignSuggestion {
  contract_id: string;
  contract_type: string;
  suggested_campaign: {
    name: string;
    description: string;
    type: string;
    start_date: string;
    end_date: string;
    milestones: [
      {
        description: string;
        due_date: string;
        tasks: [
          {
            name: string;
            type: string;
            deadline: string;
            description_json: object;
          },
        ];
      },
    ];
  };
}
