import goongApi from "@/libs/goongApi";
import type { GoongAutocompleteResponse } from "@/libs/types/goong";

export interface GoongAutocompleteParams {
  input: string;
  location?: { lat: number; lng: number };
  has_deprecated_administrative_unit?: boolean;
}

export const goongAutocompleteService = {
  getPredictions: (params: GoongAutocompleteParams) =>
    goongApi.get<GoongAutocompleteResponse>("/v2/place/autocomplete", {
      params: {
        input: params.input,
        location: params.location ? `${params.location.lat},${params.location.lng}` : undefined,
        has_deprecated_administrative_unit: params.has_deprecated_administrative_unit ?? true,
      },
    }),
};
