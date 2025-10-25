export interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ErrorResponse {
  success: boolean;
  status: string;
  status_code: number;
  errors: ErrorDetail[];
}

interface ErrorDetail {
  field: string;
  struct_field: string;
  value?: any;
  messages?: string;
}
