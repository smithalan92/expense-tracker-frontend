/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store";
import { setShouldShowAddExpenseModal } from "@/store/slices/expenses";
import {
  loadCountriesForTrip,
  loadExpenseCategories,
  resetState as resetNewExpenseState,
  selectCanSaveExpense,
} from "@/store/slices/newExpense";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CityPicker from "./CityPicker/CityPicker";
import CountryPicker from "./CountryPicker/CountryPicker";
import CurrencyPicker from "./CurrencyPicker/CurrencyPicker";
import CustomDatePicker from "./DatePicker/DatePicker";
import ExpenseAmountInput from "./ExpenseAmountInput/ExpenseAmountInput";
import ExpenseCategoryPicker from "./ExpenseCategoryPicker/ExpenseCategoryPicker";
import ExpenseDescription from "./ExpenseDescription/ExpenseDescription";

export default function AddExpenseModal() {
  const tripId = parseInt(useParams().tripId!, 10);
  const dispatch = useAppDispatch();
  const canSaveExpense = useAppSelector(selectCanSaveExpense);

  const onClickCancel = () => {
    dispatch(setShouldShowAddExpenseModal(false));
  };

  useEffect(() => {
    dispatch(loadCountriesForTrip(tripId));
    dispatch(loadExpenseCategories());

    return () => {
      dispatch(resetNewExpenseState());
    };
  }, []);

  return (
    <div className="flex w-full h-full absolute top-0 left-0 justify-center items-center bg-black/50">
      <div className="modal-box overflow-hidden absolute bottom-[-32px] md:relative box-content">
        <h2 className="font-bold text-2xl mb-2">Add Expense</h2>
        <div className="h-[550px] overflow-y-scroll pr-4">
          <div className="flex items-center py-4">
            <div className="w-24 mb-4">When</div>
            <CustomDatePicker />
          </div>
          <div className="flex items-center py-4">
            <div className="w-24">Country</div>
            <CountryPicker />
          </div>
          <div className="flex items-center py-4">
            <div className="w-24">City</div>
            <CityPicker />
          </div>
          <div className="flex items-center py-4">
            <div className="w-24">Amount</div>
            <ExpenseAmountInput />
          </div>
          <div className="flex items-center py-4">
            <div className="w-24">Currency</div>
            <CurrencyPicker />
          </div>
          <div className="flex items-center py-4">
            <div className="w-24">Category</div>
            <ExpenseCategoryPicker />
          </div>
          <div className="flex flex-col py-4">
            <div className="w-24 mb-4">Description</div>
            <ExpenseDescription />
          </div>
        </div>
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
            // onClick={onClickAddExpense}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
