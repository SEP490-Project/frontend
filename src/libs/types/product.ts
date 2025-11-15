import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { NavigateFunction } from "react-router";
import type { Pagination } from "./common";
import type { ConceptData } from "./concept";

export type ProductType = "STANDARD" | "LIMITED";
export type CapacityUnit = "ML" | "L" | "G" | "KG" | "OZ";
export type ContainerType =
  | "BOTTLE"
  | "TUBE"
  | "JAR"
  | "STICK"
  | "PENCIL"
  | "COMPACT"
  | "PALLETE"
  | "SACHET"
  | "VIAL"
  | "ROLLER_BOTTLE";
export type DispenserType =
  | "PUMP"
  | "SPRAY"
  | "DROPPER"
  | "ROLL_ON"
  | "TWIST_UP"
  | "SQUEEZE"
  | "NONE";
export type AttributeUnit = "%" | "MG" | "G" | "ML" | "L" | "IU" | "PPM" | "NONE";

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
    max_stock: number;
    is_free_shipping: boolean;
    bought_limit: number;
    premiere_date: string;
    availability_start_date: string;
    availability_end_date: string;
  };
  concept?: ConceptData;
}

export interface ProductVariant {
  id?: string;
  attributes: ProductAttribute[];
  capacity: number | null;
  capacity_unit: CapacityUnit;
  container_type: ContainerType;
  current_stock?: number | null;
  description?: string | null;
  dispenser_type: DispenserType;
  expiry_date: Date | null;
  instructions: string;
  is_default: boolean;
  manufacture_date: Date | null;
  name: string;
  price: number | null;
  story?: string | null;
  type: string;
  uses: string | null;
  weight: number;
  height: number;
  length: number;
  width: number;
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
  availability_end_date: string;
  availability_start_date: string;
  bought_limit: number | null;
  concept_id?: string | null;
  is_free_shipping: boolean;
  max_stock: number | null;
  premiere_date: string;
}

export interface CreateProductPayload {
  brand_id: string;
  category_id: string;
  description?: string | null;
  name: string;
}

export interface CreateLimitedProductPayload extends CreateProductPayload {
  task_id?: string;
  limited_attribute: LimitedAttribute;
}

export type CreateVariantImagePayload = FormData;

export interface ProductParams {
  limit?: number;
  page?: number;
  search?: string;
  type?: string;
  category_id?: string;
  status?: string;
}

export interface ProductFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  setOnSubmitStep?: React.Dispatch<React.SetStateAction<null | (() => Promise<void>)>>;
  navigate: NavigateFunction;
  steps: { path: string; label: string }[];
  currentStep: number;
  state: any;
  isDisabled: boolean;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}
