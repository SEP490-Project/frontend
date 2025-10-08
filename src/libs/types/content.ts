export interface Content {
  id: string;
  title: string;
  actor: string;
  date_time: string;
  views: number;
  status: "posted" | "draft" | "pending";
  html_content: string;
  json_content: object;
  created_at: string;
  updated_at: string;
}

export interface ContentListParams {
  page: number;
  limit: number;
  keywords?: string;
  status?: string;
  actor?: string;
  date_from?: string;
  date_to?: string;
}

export interface CreateContentRequest {
  title: string;
  html_content: string;
  json_content: object;
  status: "posted" | "draft" | "pending";
}

export interface UpdateContentRequest {
  id: string;
  title?: string;
  html_content?: string;
  json_content?: object;
  status?: "posted" | "draft" | "pending";
}

export interface ContentResponse {
  data: Content[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface SingleContentResponse {
  data: Content;
}
