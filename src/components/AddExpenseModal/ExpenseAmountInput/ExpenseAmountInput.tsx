import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectExpenseAmount,
  setExpenseAmount,
} from "@/store/slices/newExpense";
import { useCallback } from "react";

export default function ExpenseAmountInput() {
  const dispatch = useAppDispatch();
  const expenseAmount = useAppSelector(selectExpenseAmount);

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const amount = parseFloat(e.target.value);
      dispatch(setExpenseAmount(amount));
    },
    [dispatch]
  );

  return (
    <input
      type="number"
      value={expenseAmount}
      onChange={onChangeAmount}
      className="flex-1 input input-md input-bordered w-32 bg-white text-black"
    />
  );
}
