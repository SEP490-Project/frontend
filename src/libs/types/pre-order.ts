export interface PreOrderResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: PreOrderData[];
  pagination: Pagination;
}

export interface PreOrderData {
  id: string;
  user_id: string;
  variant_id: string;
  quantity: number;
  company_revenue: number;
  kol_revenue: number;
  unit_price: number;
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
  capacity: number;
  capacity_unit: string;
  container_type: string;
  dispenser_type: string;
  uses: string;
  manufacturing_date: string;
  product_type: string;
  expiry_date: string;
  instructions: string;
  attributes_description: any;
  product_name: string;
  description: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  images: IMAGE[];
  is_self_picked_up: boolean;
  status: string;
  user_bank_account?: string;
  user_bank_name?: string;
  user_bank_account_holder?: string;
  created_at: string;
  updated_at: string;
  action_notes?: ActionNote[];
  PaymentTx: PaymentTx;
  brand: Brand;
  category: Category;
  confirmation_image: string;
  staff_resource?: string;
  user_resource?: string;
  limited_properties: LimitedProperties;
}

export interface LimitedProperties {
  premiere_date: string;
  availability_start_date: string;
  availability_end_date: string;
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

export interface ActionNote {
  user_id: string;
  user_name: string;
  user_email: string;
  action_type: string;
  reason: string;
  created_at: string;
}

export interface PaymentTx {
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

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
