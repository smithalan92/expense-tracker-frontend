import { useAppDispatch } from "@/store";
import {
  addExpense,
  setShouldShowAddExpenseModal,
} from "@/store/slices/tripData";
import { formatDateForStoring } from "@/utils/date";
import { useMemo, useState } from "react";
import CityPicker from "./CityPicker/CityPicker";
import CountryPicker from "./CountryPicker/CountryPicker";
import CurrencyPicker from "./CurrencyPicker/CurrencyPicker";
import CustomDatePicker from "./DatePicker/DatePicker";
import ExpenseAmountInput from "./ExpenseAmountInput/ExpenseAmountInput";
import ExpenseCategoryPicker from "./ExpenseCategoryPicker/ExpenseCategoryPicker";
import ExpenseDescription from "./ExpenseDescription/ExpenseDescription";

export default function AddExpenseModal() {
  const dispatch = useAppDispatch();

  const [date, setDate] = useState(formatDateForStoring(new Date()));
  const [countryId, setCountryId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [currencyId, setCurrencyId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [description, setDescription] = useState("");

  const canSaveExpense = useMemo(() => {
    const parsedAmount = parseFloat(amount ?? "-1");
    return (
      date &&
      countryId &&
      cityId &&
      amount &&
      parsedAmount > 0 &&
      currencyId &&
      categoryId
    );
  }, [date, countryId, cityId, amount, currencyId, categoryId]);

  const onClickCancel = () => {
    dispatch(setShouldShowAddExpenseModal(false));
  };

  const onClickAddExpense = () => {
    dispatch(
      addExpense({
        date,
        amount: parseFloat(amount!),
        cityId: cityId!,
        currencyId: currencyId!,
        categoryId: categoryId!,
        description,
      })
    );
  };

  return (
    <div className="et-modal-backdrop overflow-hidden">
      <div className="animate-slide-in-bottom et-modal overflow-hidden absolute bottom-0 md:relative box-content w-[350px] md:w-full">
        <h2 className="font-bold text-2xl mb-2">Add Expense</h2>
        <div className="h-[450px] overflow-y-scroll pr-4">
          <div className="flex items-center py-4">
            <div className="w-24 mb-4">When</div>
            <CustomDatePicker value={date} onChange={setDate} />
          </div>
          <div className="flex items-center py-4">
            <div className="w-24">Country</div>
            <CountryPicker value={countryId} onChange={setCountryId} />
          </div>
          <div className="flex items-center py-4">
            <div className="w-24">City</div>
            <CityPicker
              value={cityId}
              selectedCountryId={countryId}
              onChange={setCityId}
            />
          </div>
          <div className="flex items-center py-4">
            <div className="w-24">Amount</div>
            <ExpenseAmountInput value={amount} onChange={setAmount} />
          </div>
          <div className="flex items-center py-4">
            <div className="w-24">Currency</div>
            <CurrencyPicker
              value={currencyId}
              selectedCountryId={countryId}
              onChange={setCurrencyId}
            />
          </div>
          <div className="flex items-center py-4">
            <div className="w-24">Category</div>
            <ExpenseCategoryPicker
              value={categoryId}
              onChange={setCategoryId}
            />
          </div>
          <div className="flex flex-col py-4">
            <div className="w-24 mb-4">Description</div>
            <ExpenseDescription value={description} onChange={setDescription} />
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
            onClick={onClickAddExpense}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
