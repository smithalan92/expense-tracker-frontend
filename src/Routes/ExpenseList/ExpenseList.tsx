import ExpenseTable from "@/components/ExpenseTable/ExpenseTable";
import Spinner from "@/components/Spinner";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  loadExpensesForTrip,
  selectExpenses,
  selectHasFailedToLoadExpenses,
  selectIsLoadingExpenses,
} from "@/store/slices/expenses";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ExpenseList() {
  const { tripId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const expenses = useAppSelector(selectExpenses);
  const isLoadingExpenses = useAppSelector(selectIsLoadingExpenses);
  const hasFailedToLoadExpenses = useAppSelector(selectHasFailedToLoadExpenses);

  useEffect(() => {
    dispatch(loadExpensesForTrip(parseInt(tripId!, 10)));
  }, [tripId]);

  const onClickGoBack = () => {
    navigate(-1);
  };

  const maybeRenderLoader = useCallback(() => {
    if (!isLoadingExpenses) return null;

    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }, [isLoadingExpenses]);

  const maybeRenderFailureState = useCallback(() => {
    if (!hasFailedToLoadExpenses) return null;

    <div className="w-full h-full flex justify-center items-center">
      Something went wrong loading expenses. Please refresh the page and try
      again.
    </div>;
  }, [hasFailedToLoadExpenses]);

  const maybeRenderExpenseList = useCallback(() => {
    if (isLoadingExpenses || hasFailedToLoadExpenses) return null;

    if (!expenses || !expenses.length) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          No expenses available
        </div>
      );
    }

    return (
      <div className="h-160">
        <ExpenseTable />
        <div className="flex justify-end mt-6">
          <button
            className="btn btn-secondary font-bold text-md mr-4"
            onClick={onClickGoBack}
          >
            Go Back
          </button>
          <button className="btn btn-primary font-bold text-md">
            Add expense
          </button>
        </div>
      </div>
    );
  }, [isLoadingExpenses, hasFailedToLoadExpenses]);

  return (
    <div className="w-full h-full">
      <>
        {maybeRenderLoader()}
        {maybeRenderFailureState()}
        {maybeRenderExpenseList()}
      </>
    </div>
  );
}
