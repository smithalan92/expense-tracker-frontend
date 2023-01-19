import Picker from "@/components/widgets/Picker/Picker";
import { useAppSelector } from "@/store";
import { selectCurrencies, selectCountryById } from "@/store/slices/tripData";
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
    return currencies.map<CurrencyPickerOption>((currency) => ({
      value: currency.id,
      label: currency.name,
    }));
  }, [currencies]);

  // TODO - This messes up if you select a currency
  // that isnt the standard currency in your selected country
  // and change country or edit it, the currency then gets changed.
  useEffect(() => {
    if (selectedCountryId && selectedCountryId !== initalCountryId.current) {
      initalCountryId.current = selectedCountryId;
      onChange(selectedCountry!.currencyId);
    }
  }, [selectedCountryId]);

  return (
    <Picker
      options={currencyOptions}
      value={value}
      onChange={onChange}
      isMulti={false}
    />
  );
}
