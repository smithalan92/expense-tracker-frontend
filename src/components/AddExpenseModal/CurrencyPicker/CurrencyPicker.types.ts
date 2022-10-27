export interface CurrencyPickerProps {
  value: number | null;
  selectedCountryId: number | null;
  onChange: (newAmount: number) => void;
}

export interface CurrencyPickerOption {
  value: number;
  label: string;
}
