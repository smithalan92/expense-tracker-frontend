import { formatDateForStoring } from "@/utils/date";
import { useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DatePickerProps } from "./DatePicker.types";

export default function CustomDatePicker({ value, onChange }: DatePickerProps) {
  const onChangeDate = (date: Date | null) => {
    const stringDate = formatDateForStoring(date!);
    onChange(stringDate);
  };

  const selectedDate = useMemo(() => new Date(value), [value]);

  return (
    <div className="flex-1">
      <DatePicker
        className="px-4 w-full h-12 rounded rounded-lg text-black"
        onChange={(date) => onChangeDate(date)}
        showTimeSelect
        selected={selectedDate}
        dateFormat="dd/MM/yyyy HH:mm"
      />
    </div>
  );
}
