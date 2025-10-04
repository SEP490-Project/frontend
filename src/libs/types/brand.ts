export interface BrandBase {
  name: string;
  description?: string | null;
  contact_email: string;
  contact_phone: string;
  website?: string | null;
  logo_url?: string | null;
}

export interface Brands extends BrandBase {
  id: string;
  status: string;
  created_at: string;
}

export type AddBrand = BrandBase;
