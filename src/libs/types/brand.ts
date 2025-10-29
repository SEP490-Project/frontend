export interface BrandBase {
  name: string;
  description?: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  website: string;
  logo_url: string;
  representative_citizen_id: string;
  representative_email: string;
  representative_name: string;
  representative_phone: string;
  representative_role: string;
  tax_number: string;
}

export interface Brands extends BrandBase {
  id: string;
  status: string;
  created_at: string;
  number_of_active_contracts: number;
  number_of_contracts: number;
}

export type AddBrand = BrandBase;
