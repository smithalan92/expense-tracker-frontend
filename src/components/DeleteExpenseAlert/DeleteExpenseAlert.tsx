import { useAppDispatch, useAppSelector } from "@/store";
import {
  resetDeleteStates,
  selectDidDeletingExpense,
  selectDidDeletingExpenseFail,
  selectExpenseById,
  selectIsDeletingExpense,
  deleteExpense,
} from "@/store/slices/tripData";
import format from "date-fns/format";
import { useCallback, useMemo } from "react";
import Spinner from "../Spinner";

export function DeleteExpenseAlert({
  expenseId,
  onClose,
}: {
  expenseId: number;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const isDeletingExpense = useAppSelector(selectIsDeletingExpense);
  const didDeleteExpense = useAppSelector(selectDidDeletingExpense);
  const hasDeletingExpenseFailed = useAppSelector(selectDidDeletingExpenseFail);

  const expense = useAppSelector((state) =>
    selectExpenseById(state, expenseId)
  )!;

  const shouldDisableButton = useMemo(() => {
    return isDeletingExpense || didDeleteExpense || hasDeletingExpenseFailed;
  }, [isDeletingExpense, didDeleteExpense, hasDeletingExpenseFailed]);

  const onClickDelete = () => {
    dispatch(deleteExpense(expenseId));
  };

  const onClickCancel = () => {
    dispatch(resetDeleteStates());
    onClose();
  };

  const closeButtonText = useMemo(() => {
    if (didDeleteExpense) return "Close";
    return "Cancel";
  }, [didDeleteExpense]);

  const maybeRenderLoader = useCallback(() => {
    if (!isDeletingExpense) return null;

    return (
      <div className="w-full h-full flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }, [isDeletingExpense]);

  const maybeRenderFailedState = useCallback(() => {
    if (!hasDeletingExpenseFailed) return null;

    return (
      <div className="w-full h-full flex items-center justify-center py-6">
        Failed to delete expense. Please try again
      </div>
    );
  }, [isDeletingExpense]);

  const maybeRenderDeletedState = useCallback(() => {
    if (!didDeleteExpense) return null;

    return (
      <div className="w-full h-full flex items-center justify-center py-6">
        Your expense has been deleted.
      </div>
    );
  }, [didDeleteExpense]);

  const maybeRenderContent = useCallback(() => {
    if (isDeletingExpense || hasDeletingExpenseFailed || didDeleteExpense)
      return null;

    return (
      <>
        <div className="mb-2">
          Are you sure you want to delete this expense?
        </div>
        <div className="flex flex-col">
          <table>
            <tbody>
              <tr>
                <td className="font-bold">Date:</td>
                <td>
                  {format(new Date(expense.localDateTime), "dd-MM-yyyy HH:mm")}
                </td>
              </tr>
              <tr>
                <td className="font-bold">Category:</td>
                <td>{expense.category.name}</td>
              </tr>
              <tr>
                <td className="font-bold">Amount:</td>
                <td>€{expense.euroAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }, [isDeletingExpense, hasDeletingExpenseFailed, didDeleteExpense]);

  return (
    <div className="et-modal-backdrop">
      <div className="animate-fade-in et-modal overflow-hidden box-content">
        {maybeRenderLoader()}
        {maybeRenderFailedState()}
        {maybeRenderContent()}
        {maybeRenderDeletedState()}
        <div className="flex justify-end items-center pt-6">
          <button
            className="btn btn-secondary font-bold text-md mr-4"
            onClick={onClickCancel}
            disabled={isDeletingExpense}
          >
            {closeButtonText}
          </button>
          <button
            className="btn btn-error font-bold text-md"
            disabled={shouldDisableButton}
            onClick={onClickDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
