export interface CityPickerProps {
  value: number | null;
  selectedCountryId: number | null;
  onChange: (selectedId: number | null) => void;
}

export interface CityPickerOption {
  countryId: number;
  value: number;
  label: string;
}
