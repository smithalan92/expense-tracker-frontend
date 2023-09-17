import Picker from "@/components/widgets/Picker/Picker";
import { useAppSelector } from "@/store";
import { selectCountryById, selectCurrencies } from "@/store/slices/tripData";
import { useEffect, useMemo, useRef } from "react";
import {
  CurrencyPickerOption,
  CurrencyPickerProps,
} from "./CurrencyPicker.types";

export default function CurrencyPicker({
  value,
  selectedCountryId,
  onChange,
}: CurrencyPickerProps) {
  const initalCountryId = useRef(selectedCountryId);
  const currencies = useAppSelector(selectCurrencies);
  const selectedCountry = useAppSelector((state) =>
    selectCountryById(state, selectedCountryId ?? 0)
  );

  const currencyOptions = useMemo(() => {
    const options = currencies
      .map<CurrencyPickerOption>((currency) => ({
        value: currency.id,
        label: `${currency.code} - ${currency.name}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    ["GBP", "USD", "EUR"].forEach((code) => {
      const optionIndex = options.findIndex((o) => o.label.startsWith(code));
      const option = { ...options[optionIndex] };
      options.splice(optionIndex, 1);
      options.unshift(option);
    });
    return options;
  }, [currencies]);

  // TODO - This messes up if you select a currency
  // that isnt the standard currency in your selected country
  // and change country or edit it, the currency then gets changed.
  useEffect(() => {
    if (selectedCountryId && selectedCountryId !== initalCountryId.current) {
      initalCountryId.current = selectedCountryId;
      onChange(selectedCountry!.currencyId);
    }
  }, [onChange, selectedCountry, selectedCountryId]);

  return (
    <Picker
      options={currencyOptions}
      value={value}
      onChange={onChange}
      isMulti={false}
    />
  );
}
