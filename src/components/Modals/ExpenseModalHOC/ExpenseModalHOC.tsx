import { useAppSelector } from "@/store";
import { selectExpenseById } from "@/store/slices/tripData";
import { formatDateForExpense } from "@/utils/date";
import { useEffect, useState } from "react";
import CityPicker from "./CityPicker/CityPicker";
import CountryPicker from "../../widgets/CountryPicker/CountryPicker";
import CurrencyPicker from "./CurrencyPicker/CurrencyPicker";
import CustomDatePicker from "../../widgets/DatePicker/DatePicker";
import ExpenseAmountInput from "./ExpenseAmountInput/ExpenseAmountInput";
import ExpenseCategoryPicker from "./ExpenseCategoryPicker/ExpenseCategoryPicker";
import ExpenseDescription from "./ExpenseDescription/ExpenseDescription";
import { ExpenseModalHOCProps } from "./ExpenseModalHOC.types";

export default function ExpenseModalHOC({
  expenseId,
  title,
  footer,
  onChangeData,
}: ExpenseModalHOCProps) {
  const expense = useAppSelector((state) =>
    selectExpenseById(state, expenseId ?? 0)
  )!;

  const [date, setDate] = useState(
    formatDateForExpense(expense ? new Date(expense.localDateTime) : new Date())
  );
  const [countryId, setCountryId] = useState<number | null>(
    expense?.country.id ?? null
  );
  const [cityId, setCityId] = useState<number | null>(expense?.city.id ?? null);
  const [amount, setAmount] = useState<string | null>(expense?.amount ?? null);
  const [currencyId, setCurrencyId] = useState<number | null>(
    expense?.currency.id ?? null
  );
  const [categoryId, setCategoryId] = useState<number | null>(
    expense?.category.id ?? null
  );
  const [description, setDescription] = useState(expense?.description ?? "");

  useEffect(() => {
    onChangeData({
      date,
      cityId,
      countryId,
      amount,
      currencyId,
      categoryId,
      description,
    });
  }, [date, cityId, amount, countryId, currencyId, categoryId, description]);

  return (
    <div className="et-modal-backdrop overflow-hidden">
      <div className="animate-slide-in-bottom et-modal overflow-hidden absolute bottom-0 md:relative box-content w-[350px] md:w-full">
        <h2 className="font-bold text-2xl mb-2">{title}</h2>
        <div className="h-[450px] overflow-y-scroll pr-4">
          <div className="flex items-center py-4">
            <div className="w-24 mb-4">When</div>
            <CustomDatePicker
              value={date}
              dateStringFormatter={formatDateForExpense}
              onChange={setDate}
            />
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
        <div>{footer}</div>
      </div>
    </div>
  );
}
