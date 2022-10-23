import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectExpenseDescription,
  setExpenseDescription,
} from "@/store/slices/newExpense";
import { useCallback } from "react";

export default function ExpenseDescription() {
  const dispatch = useAppDispatch();
  const expenseDescription = useAppSelector(selectExpenseDescription);

  const onChangeDescription = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(setExpenseDescription(e.target.value));
    },
    [dispatch]
  );

  return (
    <textarea
      className="textarea textarea-bordered"
      placeholder="Description for expense"
      value={expenseDescription}
      onChange={onChangeDescription}
    />
  );
}
