export interface Content {
  id: string;
  title: string;
  body: string;
  type: "POST";
  status: string;
  task_id: string;
  created_at: string;
  updated_at: string;
  description?: string;
  publish_date?: string;
  rejection_feedback?: string;
  affiliate_link?: string;
  ai_generated_text?: string;
  thumbnail_url?: string;
  blog?: {
    author: {
      email: string;
      id: string;
      username: string;
    };
    author_id: string;
    content_id: string;
    created_at: string;
    excerpt: string;
    read_time: number;
    tags: string[];
    updated_at: string;
  };
  content_channels: {
    auto_post_status: string;
    channel_id: string;
    channel_name: string;
    id: string;
    post_date: string;
  }[];

  // Legacy fields for backward compatibility
  actor?: string;
  date_time?: string;
  views?: number;
  content_type?: "blog" | "video";
  html_content?: string;
  json_content?: object;
  video_url?: string;
}

export interface ContentListParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: string;
  status?: string;
  type?: string;
  channel_id?: string;
  search?: string;
  from_date?: string;
  to_date?: string;
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

export interface SingleContentResponse {
  data: Content[]; // Content detail returns an array with single item
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

export interface PublishContentParams {
  id: string;
  publishDate?: string;
}

export interface RejectContentParams {
  id: string;
  feedback: string;
}

export interface ListContent {
  id: string;
  task_id: string;
  title: string;
  body: object;
  type: string;
  status: string;
  thumbnail_url?: string;
  publish_date?: string;
  created_at: string;
  updated_at: string;
  rejection_feedback?: string;
  affiliate_link?: string;
  ai_generated_text?: string;
  blog?: {
    content_id: string;
    author_id: string;
    author: {
      email: string;
      id: string;
      username: string;
    };
    tags: string[];
    excerpt: string;
    read_time: number;
    created_at: string;
    updated_at: string;
  };
  content_channels: {
    auto_post_status: string;
    channel_id: string;
    channel_name: string;
    id: string;
    post_date?: string;
  }[];
}
