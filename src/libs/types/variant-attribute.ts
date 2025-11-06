import type { Pagination } from "./common";

export interface VariantAttributeResponse {
  success: boolean;
  status_code: number;
  status: string;
  message: string;
  data: VariantAttributeData[];
  pagination: Pagination;
}

export interface VariantAttributeData {
  id: string;
  ingredient: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  created_by?: string;
  updated_by?: string;
}

export interface CreateVariantAttributePayload {
  description: string;
  ingredient: string;
}

export interface GetVariantAttributesParams {
  page?: number;
  limit?: number;
  search?: string;
}
