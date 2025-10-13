export interface KPI {
  metric: string;
  target: string;
  description?: string;
}

export interface Product {
  id?: number;
  name: string;
  description?: string;
  promotion_plan?: string[];
  material?: string[];
  kpis?: KPI[];
}

export interface Concept {
  product_id?: number;
  platform?: string;
  name?: string;
  description?: string;
  tagline?: string;
  hashtags?: string[];
  creative_notes?: string;
  content_requirements?: string[];
  materials?: string[];
  kpis?: KPI[];
}

export interface AdvertisingItem {
  name?: string;
  description?: string;
  materials?: string[];
  tagline?: string;
  platform?: string;
  hashtags?: string[];
  creative_notes?: string;
  content_requirements?: string[];
  kpis?: KPI[];
}

export interface EventItem {
  name?: string;
  date?: string;
  location?: string;
  expected_duration?: string;
  activities?: string[];
  representation_rules?: string[];
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
