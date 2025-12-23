export interface GoongMatchedSubstring {
  length: number;
  offset: number;
}

export interface GoongStructuredFormatting {
  main_text: string;
  main_text_matched_substrings: GoongMatchedSubstring[];
  secondary_text: string;
  secondary_text_matched_substrings: GoongMatchedSubstring[];
}

export interface GoongPlusCode {
  compound_code: string;
  global_code: string;
}

export interface GoongCompound {
  commune: string;
  province: string;
  district?: string;
}

export interface GoongTerm {
  offset: number;
  value: string;
}

export interface GoongDeprecatedCompound {
  district: string;
  commune: string;
  province: string;
}

export interface GoongPrediction {
  description: string;
  matched_substrings: GoongMatchedSubstring[];
  place_id: string;
  reference: string;
  structured_formatting: GoongStructuredFormatting;
  has_children: boolean;
  plus_code: GoongPlusCode;
  compound: GoongCompound;
  terms: GoongTerm[];
  types: string[];
  distance_meters: number | null;
  deprecated_description: string;
  deprecated_compound: GoongDeprecatedCompound;
}

export interface GoongAutocompleteResponse {
  predictions: GoongPrediction[];
  execution_time: string;
  status: string;
}

// Goong Directions Response Types
export interface GoongDirectionRes {
  geocoded_waypoints: any[];
  routes: Route[];
}

export interface Root {
  geocoded_waypoints: GeocodedWaypoint[];
  routes: Route[];
}

export interface GeocodedWaypoint {
  geocoder_status: string;
  place_id: string;
}

export interface Route {
  bounds: any;
  legs: Leg[];
  overview_polyline: OverviewPolyline;
  summary: string;
  warnings: any[];
  waypoint_order: any[];
}

// export interface Bounds {}

export interface Leg {
  distance: Distance;
  duration: Duration;
  end_address: string;
  end_location: EndLocation;
  start_address: string;
  start_location: StartLocation;
  steps: Step[];
}

export interface Distance {
  text: string;
  value: number;
}

export interface Duration {
  text: string;
  value: number;
}

export interface EndLocation {
  lat: number;
  lng: number;
}

export interface StartLocation {
  lat: number;
  lng: number;
}

export interface Step {
  distance: Distance2;
  duration: Duration2;
  end_location: EndLocation2;
  html_instructions: string;
  maneuver: string;
  polyline: Polyline;
  start_location: StartLocation2;
  travel_mode: string;
}

export interface Distance2 {
  text: string;
  value: number;
}

export interface Duration2 {
  text: string;
  value: number;
}

export interface EndLocation2 {
  lat: number;
  lng: number;
}

export interface Polyline {
  points: string;
}

export interface StartLocation2 {
  lat: number;
  lng: number;
}

export interface OverviewPolyline {
  points: string;
}
