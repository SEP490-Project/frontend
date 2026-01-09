import type { Pagination } from "./common";

export interface CreateConceptPayload {
  banner_url: string;
  description: string;
  name: string;
  video_thumbnail?: string;
}

export interface ConceptResponse<T> {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: T;
  pagination: Pagination;
}

export interface ConceptData {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  banner_url: any;
  video_thumbnail: any;
  limited_product: any;
}
