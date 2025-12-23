// Schedule Types for Content Scheduling System

export type ScheduleStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type ScheduleType = "CONTENT_PUBLISH" | "CONTRACT_NOTIFICATION" | "OTHER";

// Content schedule details
export interface ContentScheduleDetails {
  content_channel_id: string;
  content_id: string;
  content_title: string;
  content_type: string;
  channel_id: string;
  channel_name: string;
  channel_code: string;
}

// Contract schedule details
export interface ContractScheduleDetails {
  contract_id: string;
  contract_number: string;
  brand_id: string;
  brand_name: string;
  notification_type: string;
}

// Schedule DTO matching backend
export interface Schedule {
  schedule_id: string;
  reference_id: string;
  reference_type: ScheduleType;
  scheduled_at: string;
  status: ScheduleStatus;
  retry_count: number;
  max_retries: number;
  last_error?: string;
  executed_at?: string;
  created_at: string;
  created_by: string;
  created_by_name: string;
  updated_at?: string;
  content_details?: ContentScheduleDetails;
  contract_details?: ContractScheduleDetails;
}

// Schedule item response (for list views)
export interface ScheduleItem {
  schedule_id: string;
  content_channel_id: string;
  content_id: string;
  content_title: string;
  content_type: string;
  channel_id: string;
  channel_name: string;
  channel_code: string;
  scheduled_at: string;
  status: string;
  retry_count: number;
  last_error?: string;
  executed_at?: string;
  created_at: string;
  created_by: string;
  created_by_id: string;
}

// Filter parameters for schedule listing
export interface ScheduleFilterParams {
  page?: number;
  limit?: number;
  status?: ScheduleStatus;
  reference_type?: ScheduleType;
  from_date?: string;
  to_date?: string;
  content_id?: string;
  channel_id?: string;
}

// Request: Schedule content for publishing
export interface ScheduleContentRequest {
  content_id: string;
  channel_id: string;
  scheduled_at: string;
  auto_post?: boolean;
}

// Request: Batch schedule content to multiple channels
export interface BatchScheduleRequest {
  content_id: string;
  schedules: BatchScheduleItem[];
}

export interface BatchScheduleItem {
  channel_id: string;
  scheduled_at: string;
  auto_post?: boolean;
}

// Request: Batch schedule with same time for all channels
export interface BatchScheduleSameTimeRequest {
  content_id: string;
  channel_ids: string[];
  scheduled_at: string;
  auto_post?: boolean;
}

// Request: Reschedule content
export interface RescheduleContentRequest {
  schedule_id: string;
  new_scheduled_at: string;
}

// Response: Single schedule
export interface ScheduleResponse {
  data: {
    schedule_id: string;
    content_channel_id: string;
    content_id: string;
    content_title: string;
    channel_name: string;
    scheduled_at: string;
    status: string;
    created_at: string;
    created_by: string;
  };
  message: string;
  status: string;
  status_code: number;
  success: boolean;
}

// Response: Schedule list
export interface ScheduleListResponse {
  data: ScheduleItem[];
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

// Response: Batch schedule result
export interface BatchScheduleResultItem {
  schedule_id: string;
  channel_id: string;
  channel_name: string;
  channel_code: string;
  scheduled_at: string;
  auto_post: boolean;
}

export interface BatchScheduleFailureItem {
  channel_id: string;
  channel_name?: string;
  error: string;
}

export interface BatchScheduleResponse {
  data: {
    content_id: string;
    content_title: string;
    total_scheduled: number;
    total_failed: number;
    scheduled_channels: BatchScheduleResultItem[];
    failed_channels?: BatchScheduleFailureItem[];
  };
  message: string;
  status: string;
  status_code: number;
  success: boolean;
}

// Response: Schedule details (single schedule with full info)
export interface ScheduleDetailResponse {
  data: Schedule;
  message: string;
  status: string;
  status_code: number;
  success: boolean;
}
