import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCurrencies } from "@/store/slices/app";
import {
  selectSelectedCountry,
  selectSelectedCurrencyId,
  setSelectedCurrencyId,
} from "@/store/slices/newExpense";
import { useCallback, useEffect, useMemo } from "react";
import { CurrencyPickerOption } from "./CurrencyPicker.types";

export default function CurrencyPicker() {
  const dispatch = useAppDispatch();
  const currencies = useAppSelector(selectCurrencies);
  const selectedCountry = useAppSelector(selectSelectedCountry);
  const selectedCurrencyId = useAppSelector(selectSelectedCurrencyId);

  const currencyOptions = useMemo(() => {
    return currencies.map<CurrencyPickerOption>((currency) => ({
      value: currency.id,
      label: currency.name,
    }));
  }, [currencies]);

  const selectedCurrency = useMemo(() => {
    if (!selectedCurrencyId) return null;

    return currencyOptions.find((c) => c.value === selectedCurrencyId);
  }, [selectedCurrencyId]);

  useEffect(() => {
    if (selectedCountry) {
      dispatch(setSelectedCurrencyId(selectedCountry.currencyId));
    }
  }, [selectedCountry]);

  const onSelectCurrency = useCallback(
    (option: CurrencyPickerOption | null) => {
      dispatch(setSelectedCurrencyId(option!.value));
    },
    [dispatch]
  );

  return (
    <CustomSelect
      className="flex-1"
      menuPlacement="top"
      name="currency"
      options={currencyOptions}
      isSearchable={true}
      value={selectedCurrency}
      onChange={onSelectCurrency}
    />
  );
}
