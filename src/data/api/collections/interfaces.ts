export interface DCConstants {
  countries: DCCountry[];
  regions: DCRegion[];
  danceStyles: DanceStyleGroup[];
  typesEvents: string[];
}

export interface DanceStyleGroup {
  items: string[];
  title: string;
}

export interface DCCountry {
  country: string;
  countryCode: string;
  availableSearchString: boolean;
  cities?: string | { key: number; name: string }[];
  id: number;
}

export interface DCRegion {
  name: string;
  countries: string[];
  availableSearchString?: true;
  id?: number;
}

export interface PlaceAutocompleteResponse {
  predictions: PlaceAutocompletePrediction[];
  status: PlaceAutocompletePrediction[];
}

export interface PlaceAutocompletePrediction {
  description: string;
  place_id: string;
  reference: string;
  structured_formatting: PlaceAutocompleteFormating;
  terms: PlaceAutocompleteTerm[];
}

export interface PlaceAutocompleteFormating {
  main_text: string;
  secondary_text?: string;
}

export interface PlaceAutocompleteTerm {
  offset: number;
  value: string;
}
