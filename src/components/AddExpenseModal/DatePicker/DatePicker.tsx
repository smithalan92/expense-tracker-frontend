import { useAppDispatch, useAppSelector } from "@/store";
import { selectExpenseDate, setExpenseDate } from "@/store/slices/newExpense";
import { formatDateForStoring } from "@/utils/date";
import { useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDatePicker() {
  const dispatch = useAppDispatch();
  const selectedDateString = useAppSelector(selectExpenseDate);
  const onChangeDate = (date: Date | null) => {
    const stringDate = formatDateForStoring(date!);
    dispatch(setExpenseDate(stringDate));
  };

  const selectedDate = useMemo(
    () => new Date(selectedDateString),
    [selectedDateString]
  );

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
