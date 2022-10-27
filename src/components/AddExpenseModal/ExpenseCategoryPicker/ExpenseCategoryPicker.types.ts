export interface ExpenseCategoryPickerProps {
  value: number | null;
  onChange: (newAmount: number) => void;
}

export interface CategoryPickerOption {
  value: number;
  label: string;
}
