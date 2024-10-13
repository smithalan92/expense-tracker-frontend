import { useCallback, useMemo } from "react";

export default function ExpenseAmountInput({
  value,
  onChange,
}: ExpenseAmountInputProps) {
  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const amount = e.target.value;
      onChange(amount);
    },
    [onChange]
  );

  const showError = useMemo(() => {
    if (value === null) return false;
    const num = parseFloat(value);
    return num <= 0;
  }, [value]);

  return (
    <input
      type="number"
      placeholder="0.00"
      value={value ?? ""}
      onChange={onChangeAmount}
      className={`flex-1 input input-md input-bordered rounded-md w-32 bg-white text-black ${
        showError ? "border-4 border-red-700" : ""
      }`}
    />
  );
}

export interface ExpenseAmountInputProps {
  value: string | null;
  onChange: (newAmount: string) => void;
}
