export interface VariantAttributeResponse {
  success: boolean;
  status_code: number;
  status: string;
  message: string;
  data: VariantAttributeData[];
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
