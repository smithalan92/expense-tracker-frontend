export interface DatePickerProps {
  value: string;
  useDateOnly?: boolean;
  dateStringFormatter: (date: Date) => string;
  onChange: (date: string) => void;
}
