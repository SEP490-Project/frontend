// GHN Request Types
export interface GHNUpdateOrderStatusRequest {
  order_code: string;
  status: string;
}

// GHN Response Types
export interface GHNOrderInfo {
  available_states?: Map<string, boolean>;
  shop_id: number;
  client_id: number;
  return_name: string;
  return_phone: string;
  return_address: string;
  return_ward_code: string;
  return_district_id: number;
  return_ward_name: string;
  return_district_name: string;
  return_province_name: string;
  return_location: ReturnLocation;
  from_name: string;
  from_phone: string;
  from_hotline: string;
  from_address: string;
  from_ward_code: string;
  from_district_id: number;
  from_ward_name: string;
  from_district_name: string;
  from_province_name: string;
  from_location: FromLocation;
  deliver_station_id: number;
  to_name: string;
  to_phone: string;
  to_address: string;
  to_ward_code: string;
  to_district_id: number;
  to_ward_name: string;
  to_district_name: string;
  to_province_name: string;
  to_location: ToLocation;
  weight: number;
  length: number;
  width: number;
  height: number;
  converted_weight: number;
  calculate_weight: number;
  image_ids: any;
  service_type_id: number;
  service_id: number;
  payment_type_id: number;
  payment_type_ids: number[];
  custom_service_fee: number;
  sort_code: string;
  cod_amount: number;
  cod_collect_date: string;
  cod_transfer_date: any;
  is_cod_transferred: boolean;
  is_cod_collected: boolean;
  insurance_value: number;
  order_value: number;
  pick_station_id: number;
  client_order_code: string;
  cod_failed_amount: number;
  cod_failed_collect_date: any;
  required_note: string;
  content: string;
  note: string;
  employee_note: string;
  seal_code: string;
  pickup_time: string;
  request_delivery_time: any;
  deadline_pickup_time: any;
  items: Item[];
  coupon: string;
  coupon_campaign_id: number;
  _id: string;
  order_code: string;
  version_no: string;
  updated_ip: string;
  updated_employee: number;
  updated_client: number;
  updated_source: string;
  updated_date: string;
  updated_warehouse: number;
  created_ip: string;
  created_employee: number;
  created_client: number;
  created_source: string;
  created_date: string;
  status: string;
  internal_process: InternalProcess;
  pick_warehouse_id: number;
  deliver_warehouse_id: number;
  current_warehouse_id: number;
  return_warehouse_id: number;
  next_warehouse_id: number;
  current_transport_warehouse_id: number;
  leadtime: string;
  leadtime_order: LeadtimeOrder;
  order_date: string;
  data: any;
  soc_id: string;
  finish_date: string;
  tag: string[];
  is_partial_return: boolean;
  is_document_return: boolean;
  pickup_shift: any;
  transaction_ids: string[];
  transportation_status: string;
  transportation_phase: string;
  extra_service: ExtraService;
  config_fee_id: string;
  extra_cost_id: string;
  standard_config_fee_id: string;
  standard_extra_cost_id: string;
  ecom_config_fee_id: number;
  ecom_extra_cost_id: number;
  ecom_standard_config_fee_id: number;
  ecom_standard_extra_cost_id: number;
  is_b2b: boolean;
  operation_partner: string;
  process_partner_name: string;
  delivery_days_of_week: number;
  is_new_multiple: boolean;
  from_address_v2: string;
  from_ward_id_v2: number;
  from_province_id_v2: number;
  is_new_from_address: boolean;
  to_address_v2: string;
  to_ward_id_v2: number;
  to_province_id_v2: number;
  is_new_to_address: boolean;
  return_address_v2: string;
  return_ward_id_v2: number;
  return_province_id_v2: number;
  is_new_return_address: boolean;
}

export interface ReturnLocation {
  lat: number;
  long: number;
  cell_code: string;
  place_id: string;
  trust_level: number;
  wardcode: string;
  map_source: string;
}

export interface FromLocation {
  lat: number;
  long: number;
  cell_code: string;
  place_id: string;
  trust_level: number;
  wardcode: string;
  map_source: string;
}

export interface ToLocation {
  lat: number;
  long: number;
  cell_code: string;
  place_id: string;
  trust_level: number;
  wardcode: string;
  map_source: string;
}

export interface Item {
  name: string;
  quantity: number;
  length: number;
  width: number;
  height: number;
  category: any;
  weight: number;
  status: string;
  item_order_code: string;
  current_warehouse_id: number;
}

export interface InternalProcess {
  status: string;
  type: string;
}

export interface LeadtimeOrder {
  from_estimate_date: string;
  to_estimate_date: string;
}

export interface ExtraService {
  document_return: DocumentReturn;
  double_check: boolean;
  lastmile_ahamove_bulky: boolean;
  lastmile_trip_code: string;
  original_deliver_warehouse_id: number;
}

export interface DocumentReturn {
  flag: boolean;
}
