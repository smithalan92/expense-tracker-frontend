import { useAppDispatch } from "@/store";
import {
  addExpense,
  setShouldShowAddExpenseModal,
} from "@/store/slices/tripData";
import { useMemo, useState } from "react";
import ExpenseModalHOC from "../ExpenseModalHOC/ExpenseModalHOC";
import { ExpenseData } from "../ExpenseModalHOC/ExpenseModalHOC.types";

export default function AddExpenseModal() {
  const dispatch = useAppDispatch();

  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null);

  const canSaveExpense = useMemo(() => {
    const parsedAmount = parseFloat(expenseData?.amount ?? "-1");
    return (
      expenseData?.date &&
      expenseData?.countryId &&
      expenseData?.cityId &&
      expenseData?.amount &&
      parsedAmount > 0 &&
      expenseData?.currencyId &&
      expenseData?.categoryId &&
      expenseData.userId > 0
    );
  }, [expenseData]);

  const onClickCancel = () => {
    dispatch(setShouldShowAddExpenseModal(false));
  };

  const onClickAddExpense = () => {
    dispatch(
      addExpense({
        date: expenseData!.date,
        amount: parseFloat(expenseData!.amount!),
        cityId: expenseData!.cityId!,
        currencyId: expenseData!.currencyId!,
        categoryId: expenseData!.categoryId!,
        description: expenseData!.description,
        userId: expenseData!.userId,
      })
    );
  };

  return (
    <ExpenseModalHOC
      title="Add Expense"
      onChangeData={setExpenseData}
      footer={
        <div className="flex justify-end pt-8">
          <button
            className="btn btn-secondary font-bold text-md mr-4"
            onClick={onClickCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary font-bold text-md"
            disabled={!canSaveExpense}
            onClick={onClickAddExpense}
          >
            Save
          </button>
        </div>
      }
    />
  );
}
