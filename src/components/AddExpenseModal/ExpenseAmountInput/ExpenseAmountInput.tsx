import { useCallback } from "react";
import { ExpenseAmountInputProps } from "./ExpenseAmountInput.types";

export default function ExpenseAmountInput({
  value,
  onChange,
}: ExpenseAmountInputProps) {
  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const amount = parseFloat(e.target.value);
      onChange(amount);
    },
    [onChange]
  );

  return (
    <input
      type="number"
      placeholder="0.00"
      value={value ?? ""}
      onChange={onChangeAmount}
      className="flex-1 input input-md input-bordered w-32 bg-white text-black"
    />
  );
}
