export interface ReviewResponse<T> {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: T[];
  pagination: Pagination;
}

export interface ReviewData {
  user_info: UserInfo;
  product: Product;
  review_content: ReviewContent;
}

export interface UserInfo {
  id: string;
  user_id: string;
  user_name: string;
  full_name: string;
  avatar_url: string;
}

export interface Product {
  id: string;
  capacity_unit: string;
  container_type: string;
  dispenser_type: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  product_id: string;
  name: string;
  type: string;
  category: Category;
  limited_info?: LimitedInfo;
  brand: Brand;
}

export interface Category {
  id: string;
  name: string;
}

export interface LimitedInfo {
  achievable_quantity: number;
  premiere_date: string;
  availability_start_date: string;
  availability_end_date: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  website: string;
  status: string;
  logo_url: string;
  created_at: string;
}

export interface ReviewContent {
  rating_stars: number;
  comment: string;
  assets_url?: string;
  created_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  brand_id?: string;
  // product_id?: string;
  from_date?: string;
  to_date?: string;
  rating_stars_min?: number;
  rating_stars_max?: number;
  order_by?: "created_at" | "rating_stars";
  order_direction?: "asc" | "desc";
}
