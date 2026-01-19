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
  is_self_picked_up: boolean;
  user_note: string;
  order_type: string;
  ghn_order_code?: string;
  order_items: OrderItem[];
  confirmation_image?: string;
  payment_transaction: PaymentTransaction;
  bank_account?: string;
  bank_name?: string;
  bank_account_holder?: string;
  staff_resource?: string;
  user_resource?: string;
}

interface PaymentTransaction {
  id: string;
  reference_id: string;
  reference_type: string;
  amount: string;
  method: string;
  status: string;
  transaction_date: string;
  gateway_ref: string;
  gateway_id: string;
  updated_at: string;
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
  images: IMAGE[];
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
  is_reviewed: boolean;
  product_name: string;
  description: string;
  product_type: string;
  limited_properties: any;
  brand: Brand;
  category: Category;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Brand {
  id: string;
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  website: string;
  logo_url: string;
  tax_number: string;
  representative_name: string;
  representative_role: string;
  representative_email: string;
}

interface IMAGE {
  image_url: string;
  alt_text: string;
  is_primary: boolean;
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
  createdFrom?: string;
  createdTo?: string;
}

export interface PriceBreakDownResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: PriceBreakDown[];
}

export interface PriceBreakDown {
  item_id: string;
  company_percentage: number;
  kol_percentage: number;
  company_amount: number;
  kol_amount: number;
}
