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
