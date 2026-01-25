import type { Pagination } from "./common";

export type ProductOptionType =
  | "CAPACITY_UNIT"
  | "CONTAINER_TYPE"
  | "DISPENSER_TYPE"
  | "ATTRIBUTE_UNIT";

export interface ProductOption {
  id: string;
  type: ProductOptionType;
  code: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductOptionResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: ProductOption | ProductOption[] | null;
  pagination?: Pagination;
}

export interface ProductOptionsByTypeResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: ProductOption[];
}

export interface ProductOptionsGroupedResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: {
    capacity_unit: ProductOption[];
    container_type: ProductOption[];
    dispenser_type: ProductOption[];
    attribute_unit: ProductOption[];
  };
}

export interface CreateProductOptionPayload {
  type: ProductOptionType;
  code: string;
  name: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateProductOptionPayload {
  code?: string;
  name?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface ProductOptionFilterParams {
  type?: ProductOptionType;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}
