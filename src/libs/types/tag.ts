export interface Tag {
  id: string;
  name: string;
  description?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  deleted_at?: string | null;
}

export interface TagListParams {
  page: number;
  limit: number;
  keywords?: string;
}

export interface CreateTagRequest {
  name: string;
  description?: string;
}

export interface UpdateTagRequest {
  name: string;
  description?: string;
}

export interface TagResponse {
  data: Tag[];
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

export interface SingleTagResponse {
  data: Tag;
  message: string;
  status: string;
  status_code: number;
  success: boolean;
}
