import { useCallback } from "react";
import { ExpenseDescriptionProps } from "./ExpenseDescription.types";

export default function ExpenseDescription({
  value,
  onChange,
}: ExpenseDescriptionProps) {
  const onChangeDescription = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <textarea
      className="textarea rounded-md bg-white textarea-bordered"
      value={value}
      onChange={onChangeDescription}
    />
  );
}
