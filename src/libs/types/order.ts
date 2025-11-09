import type { Pagination } from "./common";
import type { ProductAttribute } from "./product";

export interface OrderData {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  full_name: string;
  phone_number: string;
  email: string;
  street: string;
  address_line2: string;
  city: string;
  ghn_province_id: number;
  ghn_district_id: number;
  ghn_ward_code: string;
  province_name: string;
  district_name: string;
  ward_name: string;
  shipping_fee: number;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  payment_id: string;
  payment_bin: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  subtotal: number;
  unit_price: number;
  capacity: number;
  capacity_unit: string;
  container_type: string;
  dispenser_type: string;
  uses: string;
  manufacturing_date?: string;
  expiry_date: string;
  instructions: string;
  attributes_description?: ProductAttribute[];
  status: string;
  updated_at: string;
  weight: number;
  height: number;
  length: number;
  width: number;
}

export interface OrderResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: OrderData[];
  pagination: Pagination;
}

export interface OrderRequestQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
