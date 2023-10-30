import Modal from "@/components/Modals/ModalBase/Modal";
import ModalBody from "@/components/Modals/ModalBase/ModalBody";
import ModalFooter from "@/components/Modals/ModalBase/ModalFooter";
import ModalHeader from "@/components/Modals/ModalBase/ModalHeader";
import Picker from "@/components/widgets/Picker/Picker";
import { PickerOption } from "@/components/widgets/Picker/Picker.types";
import { useAppSelector } from "@/store";
import {
  selectCategories,
  selectCountries,
  selectExpenseById,
} from "@/store/slices/tripData";
import { formatDateForExpense } from "@/utils/date";
import { useEffect, useMemo, useState } from "react";
import CustomDatePicker from "../../widgets/DatePicker/DatePicker";
import CityPicker from "./CityPicker/CityPicker";
import CurrencyPicker from "./CurrencyPicker/CurrencyPicker";
import ExpenseAmountInput from "./ExpenseAmountInput/ExpenseAmountInput";
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
  const currentUserId = useAppSelector((state) => state.app.user!.id);
  const tripUsers = useAppSelector((state) => state.tripData.users);
  const userOptions = useMemo(() => {
    return tripUsers.map<PickerOption>((u) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u.id,
    }));
  }, [tripUsers]);

  const countries = useAppSelector(selectCountries);
  const countryOptions = useMemo(() => {
    return countries.map<PickerOption>((c) => ({
      label: c.name,
      value: c.id,
    }));
  }, [countries]);

  const currenciesForCountries = useMemo(() => {
    // 149 is USD, always include it since its popular...
    let options = [...countries.map((c) => c.currencyId), 149];

    // If we're editing an expense we always need to include that currency as well;
    if (expense?.currency.id) {
      options = [...options, expense.currency.id];
    }

    return options;
  }, [countries, expense]);

  const categories = useAppSelector(selectCategories);
  const categoryOptions = useMemo(() => {
    return categories.map<PickerOption>((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [categories]);

  const [date, setDate] = useState(
    formatDateForExpense(expense ? new Date(expense.localDateTime) : new Date())
  );
  const [userId, setUserId] = useState(expense?.user.id ?? currentUserId);
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
  const [shouldShowAllCurrencies, setShouldShowAllCurrencies] = useState(false);

  useEffect(() => {
    onChangeData({
      date,
      countryId,
      cityId,
      amount,
      currencyId,
      categoryId,
      description,
      userId,
    });
  }, [
    date,
    cityId,
    amount,
    countryId,
    currencyId,
    categoryId,
    description,
    userId,
    onChangeData,
  ]);

  useEffect(() => {
    if (!expenseId && countries.length === 1) {
      const firstCountryId = countries[0].id;
      setCountryId(firstCountryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal>
      <ModalHeader title={title} />
      <ModalBody>
        <div className="flex items-center py-4">
          <div className="w-24">When</div>
          <CustomDatePicker
            value={date}
            dateStringFormatter={formatDateForExpense}
            onChange={setDate}
          />
        </div>
        <div className="flex items-center py-4">
          <div className="w-24">Country</div>
          <Picker
            options={countryOptions}
            value={countryId}
            onChange={setCountryId}
            isMulti={false}
          />
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
        <div className="flex items-center pt-4">
          <div className="w-24">Currency</div>
          <CurrencyPicker
            value={currencyId}
            selectedCountryId={countryId}
            onChange={setCurrencyId}
            availableCurrencyIds={
              shouldShowAllCurrencies ? undefined : currenciesForCountries
            }
          />
        </div>
        <div className="flex items-center pt-2 pb-4">
          <div className="w-24" />
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xs">Display all currencies</span>
            <input
              className="ml-2"
              name="showAllCurrencies"
              type="checkbox"
              checked={shouldShowAllCurrencies}
              onChange={() =>
                setShouldShowAllCurrencies(!shouldShowAllCurrencies)
              }
            />
          </div>
        </div>
        <div className="flex items-center py-4">
          <div className="w-24">Category</div>
          <Picker
            options={categoryOptions}
            value={categoryId}
            onChange={setCategoryId}
            isMulti={false}
          />
        </div>
        <div className="flex items-center py-4">
          <div className="w-24">Person</div>
          <Picker
            options={userOptions}
            value={userId}
            onChange={setUserId}
            isMulti={false}
          />
        </div>
        <div className="flex flex-col py-4">
          <div className="w-24 mb-4">Description</div>
          <ExpenseDescription value={description} onChange={setDescription} />
        </div>
      </ModalBody>
      <ModalFooter>{footer}</ModalFooter>
    </Modal>
  );
}
