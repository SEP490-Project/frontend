import type { Pagination } from "./common";

export interface UserData {
  id: string;
  username: string;
  email: string;
  role:
    | "CUSTOMER"
    | "BRAND_PARTNER"
    | "SALES_STAFF"
    | "MARKETING_STAFF"
    | "CONTENT_STAFF"
    | "ADMIN";
  full_name: string;
  avatar_url: string | null;
  phone: string;
  date_of_birth: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string;
  current_login_device: string[];
  number_of_sessions: number;
  shipping_address: ShippingAddress[];
}

export interface ShippingAddress {
  id: string;
  user_id: string;
  type: string;
  full_name: string;
  phone_number: string;
  email: string;
  street: string;
  address_line_2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  company: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserResponse<T> {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data?: T;
  pagination?: Pagination;
}

export interface UserParams {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  is_active?: boolean;
}
