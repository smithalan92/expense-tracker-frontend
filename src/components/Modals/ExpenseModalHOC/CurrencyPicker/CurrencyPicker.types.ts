export interface CurrencyPickerProps {
  value: number | null;
  selectedCountryId: number | null;
  onChange: (newAmount: number) => void;
  availableCurrencyIds?: number[];
}

export interface CurrencyPickerOption {
  value: number;
  label: string;
}
