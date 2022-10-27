export interface CountryPickerProps {
  value: number | null;
  onChange: (selectedId: number) => void;
}

export interface CountryPickerOption {
  value: number;
  label: string;
}
