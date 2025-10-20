export interface CategoryResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: ProductCategory[];
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parent_category?: ProductCategory | null;
  created_at: Date;
  updated_at: Date;
}

export interface createCategoryPayload {
  description?: string;
  name: string;
  parent_category_id?: string;
}

export interface ProductCategoryParams {
  page: number;
  limit: number;
  search?: string;
  deleted?: boolean;
}
