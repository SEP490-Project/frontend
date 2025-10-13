export interface ProductResponse {
  data: ProductData[];
  limit: number;
  offset: number;
  total: number;
}

export interface ProductData {
  id: string;
  brand_id: string;
  brand_logo_url: string;
  category_lv1: string;
  category_lv2: string;
  description: string;
  name: string;
  price: number;
  type: string;
  variant: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  attributes: ProductAttribute[];
  capacity: number;
  capacity_unit: string;
  container_type: string;
  created_at: Date;
  current_stock: number;
  description: string;
  dispenser_type: string;
  expiry_date: Date | null;
  instructions: string;
  is_default: boolean;
  manufacture_date: Date | null;
  name: string;
  price: number;
  story: string;
  type: string;
  updated_at: Date;
  uses: string;
}

export interface ProductAttribute {
  description: string;
  ingredients: string;
  unit: string;
  value: number;
}
