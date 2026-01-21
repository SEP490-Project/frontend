import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { NavigateFunction } from "react-router";
import type { Pagination } from "./common";
import type { ConceptData } from "./concept";

export type ProductType = "STANDARD" | "LIMITED";

// Product option types are now managed via database and fetched from API
// These types remain as string for backward compatibility
export type CapacityUnit = string;
export type ContainerType = string;
export type DispenserType = string;
export type AttributeUnit = string;

export interface ProductResponse<T> {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: T;
  pagination: Pagination;
}

export interface ProductData {
  id: string;
  brand_id: string;
  brand_logo_url: string;
  brand_name: string;
  brand_place_holder: string;
  thumbnail_url: string[] | null;
  is_active: boolean;
  status?: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "REVISION"; // added optional since not always needed
  category: {
    id: string;
    name: string;
    description: string;
  };
  description: string;
  name: string;
  type: ProductType;
  variants?: ProductVariant[];
  created_at: Date;
}

export interface LimitedProductData extends ProductData {
  limited_product?: {
    achievable_quantity?: number;
    is_free_shipping: boolean;
    premiere_date: string;
    availability_start_date: string;
    availability_end_date: string;
  };
  concept?: ConceptData;
}

export interface ProductVariant {
  id?: string;
  attributes: ProductAttribute[];
  current_stock?: number | null;
  capacity: number | null;
  capacity_unit: CapacityUnit;
  container_type: ContainerType;
  input_stock: number | null;
  description?: string | null;
  dispenser_type: DispenserType;
  expiry_date: Date | null;
  instructions: string | null;
  is_default: boolean;
  manufacturing_date?: Date | null;
  name: string;
  price: number | null;
  story?: string | null;
  type: string;
  uses: string | null;
  weight: number | null;
  height: number | null;
  length: number | null;
  width: number | null;
  pre_order_limit?: number | null;
}

export interface VariantWithImage extends ProductVariant {
  images: ProductVariantImage[];
}

export interface ProductVariantImage {
  id: string;
  variant_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  created_at: Date;
}

export interface ProductAttribute {
  attribute_id?: string;
  description?: string | null;
  ingredient?: string | null;
  unit: string;
  value: number;
}
export interface LimitedAttribute {
  achievable_quantity?: number;
  availability_end_date: string;
  availability_start_date: string;
  concept_id?: string | null;
  is_free_shipping: boolean;
  premiere_date: string;
}

export interface CreateProductPayload {
  brand_id?: string | null;
  category_id: string;
  description?: string | null;
  name: string;
}

export interface CreateLimitedProductPayload extends CreateProductPayload {
  task_id?: string;
  limited_attribute: LimitedAttribute;
}

export interface CreateStandardProductPayload extends CreateProductPayload {
  brand_place_holder: string;
}

export type CreateVariantImagePayload = FormData;

export interface ProductParams {
  limit?: number;
  page?: number;
  search?: string;
  type?: string;
  category_id?: string;
  brand_id?: string;
  status?: string;
  user_id?: string;
}

export interface LimitedProductParams extends ProductParams {
  filter_preorder?: boolean;
  filter_order?: boolean;
  premiere_date_to?: string;
  availability_start_date_from?: string;
  availability_start_date_to?: string;
  availability_end_date_from?: string;
  availability_end_date_to?: string;
}

export interface ProductFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  setOnSubmitStep?: React.Dispatch<React.SetStateAction<null | (() => Promise<void>)>>;
  navigate?: NavigateFunction;
  steps?: { path: string; label: string }[];
  currentStep?: number;
  state?: any;
  isDisabled?: boolean;
  setIsDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
}
