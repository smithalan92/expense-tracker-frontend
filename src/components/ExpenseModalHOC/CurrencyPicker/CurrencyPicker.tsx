import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { useAppSelector } from "@/store";
import { selectCurrencies, selectCountryById } from "@/store/slices/tripData";
import { useCallback, useEffect, useMemo } from "react";
import {
  CurrencyPickerOption,
  CurrencyPickerProps,
} from "./CurrencyPicker.types";

export default function CurrencyPicker({
  value,
  selectedCountryId,
  onChange,
}: CurrencyPickerProps) {
  const currencies = useAppSelector(selectCurrencies);
  const selectedCountry = useAppSelector((state) =>
    selectCountryById(state, selectedCountryId ?? 0)
  );

  const currencyOptions = useMemo(() => {
    return currencies.map<CurrencyPickerOption>((currency) => ({
      value: currency.id,
      label: currency.name,
    }));
  }, [currencies]);

  const selectedCurrency = useMemo(() => {
    if (!value) return null;

    return currencyOptions.find((c) => c.value === value);
  }, [value]);

  // TODO - This messes up if you select a currency
  // that isnt the standard currency in your selected country
  // and change country or edit it, the currency then gets changed.
  useEffect(() => {
    if (selectedCountry) {
      onChange(selectedCountry.currencyId);
    }
  }, [selectedCountry]);

  const onSelectCurrency = useCallback(
    (option: CurrencyPickerOption | null) => {
      onChange(option!.value);
    },
    [onChange]
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
