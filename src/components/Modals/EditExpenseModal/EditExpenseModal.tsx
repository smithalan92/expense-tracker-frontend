import SpinnerOverlay from "@/components/widgets/SpinnerOverlay";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  editExpense,
  selectExpenseById,
  selectIsEditingExpense,
  selectTrip,
} from "@/store/slices/tripData";
import { EditExpenseParams } from "@/store/slices/tripData.types";
import { useMemo, useState } from "react";
import ExpenseModalHOC from "../ExpenseModalHOC/ExpenseModalHOC";
import { ExpenseData } from "../ExpenseModalHOC/ExpenseModalHOC.types";
import { EditExpenseModalProps } from "./EditExpenseModal.types";

export default function EditExpenseModal({
  expenseId,
  onClose,
}: EditExpenseModalProps) {
  const dispatch = useAppDispatch();
  const trip = useAppSelector(selectTrip);
  const isEditingExpense = useAppSelector(selectIsEditingExpense);

  const expense = useAppSelector((state) =>
    selectExpenseById(state, expenseId)
  );
  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null);

  const canUpdateExpense = useMemo(() => {
    if (!expenseData || !expense) return false;

    const parsedAmount = parseFloat(expenseData?.amount ?? "-1");
    return (
      expenseData.date &&
      expenseData.countryId &&
      expenseData.cityId &&
      expenseData.amount &&
      parsedAmount > 0 &&
      expenseData.currencyId &&
      expenseData.categoryId &&
      expenseData.userId &&
      (expenseData.date !== expense.localDateTime ||
        expenseData.countryId !== expense.country.id ||
        expenseData.cityId !== expense.city.id ||
        expenseData.amount !== expense.amount ||
        expenseData.currencyId !== expense.currency.id ||
        expenseData.categoryId !== expense.category.id ||
        expenseData.description !== expense.description ||
        expenseData.userId !== expense.user.id)
    );
  }, [expenseData, expense]);

  const onClickUpdate = async () => {
    if (!expenseData || !expense) return;

    const params: EditExpenseParams = {
      tripId: trip.id,
      expenseId: expense!.id,
    };

    if (expenseData.date !== expense.localDateTime) {
      params.date = expenseData.date;
    }

    if (expenseData.countryId && expenseData.countryId !== expense.country.id) {
      params.countryId = expenseData.countryId!;
    }

    if (expenseData.cityId && expenseData.cityId !== expense.city.id) {
      params.cityId = expenseData.cityId;
    }

    if (expenseData.amount && expenseData.amount !== expense.amount) {
      params.amount = parseFloat(expenseData.amount);
    }

    if (
      expenseData.currencyId &&
      expenseData.currencyId !== expense.currency.id
    ) {
      params.currencyId = expenseData.currencyId;
    }

    if (
      expenseData.categoryId &&
      expenseData.categoryId !== expense.category.id
    ) {
      params.categoryId = expenseData.categoryId;
    }

    if (expenseData.description !== expense.description) {
      params.description = expenseData.description;
    }

    if (expenseData.userId !== expense.user.id) {
      params.userId = expenseData.userId;
    }
    dispatch(editExpense(params));
    onClose();
  };

  return (
    <>
      <ExpenseModalHOC
        expenseId={expenseId}
        title="Edit Expense"
        onChangeData={setExpenseData}
        footer={
          <>
            <button
              className="btn btn-secondary font-bold text-md mr-4"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary font-bold text-md"
              disabled={!canUpdateExpense}
              onClick={onClickUpdate}
            >
              Update
            </button>
          </>
        }
      />
      {isEditingExpense && <SpinnerOverlay />}
    </>
  );
}
