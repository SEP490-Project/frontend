export interface Content {
  id: string;
  title: string;
  body: string | object;
  type: string;
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
  body: string | object;
  type: string;
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
  body: string | object;
  type: string;
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

export interface TikTokCreatorInfo {
  comment_disabled: boolean;
  creator_avatar_url: string;
  creator_nickname: string;
  creator_username: string;
  duet_disabled: boolean;
  max_video_post_duration_sec: number;
  privacy_level_options: string[];
  stitch_disabled: boolean;
}

export interface TikTokApiError {
  code: string;
  log_id: string;
  message: string;
}

export interface TikTokCreatorResponse {
  data: {
    data: TikTokCreatorInfo;
    error: TikTokApiError;
  };
  message: string;
  status: string;
  status_code: number;
  success: boolean;
}

export interface ListContent {
  id: string;
  task_id: string;
  title: string;
  body: object;
  type: string;
  status: string;
  thumbnail_url?: string;
  video_url?: string;
  description?: string;
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

// AI Content Generation Types
export interface AIGenerateRequest {
  json_mode: boolean;
  model: string;
  prompt: string;
  stream: boolean;
}

export interface AIGenerateResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: {
    content: string;
    tokens_used?: number;
    model_used?: string;
  };
}

export interface AIStructuredContentRequest {
  context: string;
  model: string;
  platform: string;
  stream: boolean;
  tone: string;
}

export interface AIStructuredContentResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: {
    title: string;
    content: string;
    description?: string;
    tags?: string[];
    excerpt?: string;
    tokens_used?: number;
    model_used?: string;
  };
}

export interface AIModel {
  provider: string;
  base_url: string;
  enable: boolean;
  models: string[];
  id?: string;
  name?: string;
  type?: string;
  max_tokens?: number;
  description?: string;
}

export interface AIModelsResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: AIModel[];
}

// TipTap JSON Content Types
export interface TipTapMark {
  type: string;
  attrs?: Record<string, any>;
}

export interface TipTapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  text?: string;
  marks?: TipTapMark[];
}

export interface TipTapDocument {
  type: "doc";
  content: TipTapNode[];
}

// Streaming State Types
export interface StreamingState {
  isStreaming: boolean;
  streamingContent: string;
  streamingProgress: number;
  tokensUsed: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null;
}

export interface StreamedContentResult {
  content: string | TipTapDocument;
  isJSON: boolean;
  title?: string;
  description?: string;
  tags?: string[];
  excerpt?: string;
}
