export interface Content {
  id: string;
  title: string;
  actor: string;
  date_time: string;
  views: number;
  status: string;
  content_type?: "blog" | "video";
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
  body: string;
  type: "POST";
  blog_fields?: {
    author_id: string;
    excerpt: string;
    read_time: number;
    tags: string[];
  };
  channels: string[];
  task_id?: string | null;
  affiliate_link?: string | null;
  ai_generated_text?: string | null;
}

export interface UpdateContentRequest {
  id: string;
  title: string;
  body: string;
  type: "POST";
  blog_fields?: {
    author_id: string;
    excerpt: string;
    read_time: number;
    tags: string[];
  };
  channels: string[];
  affiliate_link?: string | null;
  ai_generated_text?: string | null;
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

export interface PublishContentParams {
  id: string;
  publishDate?: string;
}

export interface RejectContentParams {
  id: string;
  reason: string;
}
