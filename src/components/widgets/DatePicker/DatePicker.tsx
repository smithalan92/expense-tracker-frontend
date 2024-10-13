import { useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDatePicker({
  value,
  useDateOnly,
  dateStringFormatter,
  onChange,
}: DatePickerProps) {
  const onChangeDate = (date: Date | null) => {
    const stringDate = dateStringFormatter(date!);
    onChange(stringDate);
  };
  const selectedDate = useMemo(() => new Date(value), [value]);

  const dateFormat = useMemo(() => {
    if (useDateOnly) return "dd/MM/yyyy";
    return "dd/MM/yyyy HH:mm";
  }, [useDateOnly]);

  return (
    <div className="flex-1">
      <DatePicker
        className="px-4 w-full h-12 rounded rounded-lg text-base border border-solid border-gray-300"
        onChange={(date) => onChangeDate(date)}
        showTimeSelect={!useDateOnly}
        selected={selectedDate}
        dateFormat={dateFormat}
      />
    </div>
  );
}

export interface DatePickerProps {
  value: string;
  useDateOnly?: boolean;
  dateStringFormatter: (date: Date) => string;
  onChange: (date: string) => void;
}
