export interface KPI {
  metric: string;
  target: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  material_url: string[];
  kpis?: KPI[];
}

export interface Concept {
  product_id: number;
  platform: string;
  name: string;
  description: string;
  tagline: string;
  hash_tag: string[];
  creative_notes?: string;
  content_requirements?: string[];
  material_url: string[];
  kpis?: KPI[];
}

export interface AdvertisingItem {
  id: number;
  name: string;
  description: string;
  material_url: string[];
  tagline: string;
  platform: string;
  hash_tag: string[];
  creative_notes?: string;
  content_requirements?: string[];
  kpis?: KPI[];
}

export interface EventItem {
  id: number;
  name: string;
  location: string;
  date: string;
  expected_duration: string;
  activities: string[];
  representation_rules: string[];
  kpis?: KPI[];
}

export type CONTRACT_TYPE = "CO_PRODUCING" | "ADVERTISING" | "AFFILIATE" | "BRAND_AMBASSADOR";

export interface ScopeOfWorkShape {
  CONTRACT_TYPE: CONTRACT_TYPE;
  deliverables?: any;
  general_requirements?: string[];
}

export interface ScopeOfWorkProps {
  formData: any;
  onUpdateScopeOfWork: (updates: any) => void;
}
