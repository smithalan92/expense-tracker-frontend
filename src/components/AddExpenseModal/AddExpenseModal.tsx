/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectShouldShowAddExpenseModal,
  setShouldShowAddExpenseModal,
} from "@/store/slices/expenses";
import {
  loadCountriesForTrip,
  resetState as resetNewExpenseState,
} from "@/store/slices/newExpense";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CityPicker from "./CityPicker/CityPicker";
import CountryPicker from "./CountryPicker/CountryPicker";

export default function AddExpenseModal() {
  const tripId = parseInt(useParams().tripId!, 10);
  const dispatch = useAppDispatch();
  const shouldShowAddExpenseModal = useAppSelector(
    selectShouldShowAddExpenseModal
  );

  useEffect(() => {
    dispatch(loadCountriesForTrip(tripId));
  }, []);

  return (
    <div className="flex w-full h-full absolute top-0 left-0 justify-center items-center bg-black/50">
      <div className="modal-box h-160 overflow-y-scroll absolute bottom-[-32px] md:relative">
        <h2 className="font-bold text-lg">Add Expense</h2>
        <div className="flex items-center py-4">
          <span className="w-24">Country</span>
          <CountryPicker />
        </div>
        <div className="flex items-center py-4">
          <span className="w-24">City</span>
          <CityPicker />
        </div>
      </div>
    </div>
  );
}
