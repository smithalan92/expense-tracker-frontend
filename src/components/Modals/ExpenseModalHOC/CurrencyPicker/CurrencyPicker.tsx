import Picker from "@/components/widgets/Picker/Picker";
import { useAppSelector } from "@/store";
import { selectCountryById, selectCurrencies } from "@/store/slices/tripData";
import { useEffect, useMemo, useRef } from "react";

export default function CurrencyPicker({
  value,
  selectedCountryId,
  onChange,
  availableCurrencyIds,
}: CurrencyPickerProps) {
  const initalCountryId = useRef(selectedCountryId);
  const currencies = useAppSelector(selectCurrencies);
  const selectedCountry = useAppSelector((state) =>
    selectCountryById(state, selectedCountryId ?? 0)
  );

  const currencyOptions = useMemo(() => {
    const baseOptions = availableCurrencyIds?.length
      ? currencies.filter((c) => availableCurrencyIds.includes(c.id))
      : currencies;

    const options = baseOptions
      .map<CurrencyPickerOption>((currency) => ({
        value: currency.id,
        label: `${currency.code} - ${currency.name}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    ["GBP", "USD", "EUR"].forEach((code) => {
      const optionIndex = options.findIndex((o) => o.label.startsWith(code));
      if (optionIndex > 0) {
        const option = { ...options[optionIndex] };
        options.splice(optionIndex, 1);
        options.unshift(option);
      }
    });
    return options;
  }, [currencies, availableCurrencyIds]);

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

export interface CurrencyPickerProps {
  value: number | null;
  selectedCountryId: number | null;
  onChange: (newAmount: number) => void;
  availableCurrencyIds?: number[];
}

export interface CurrencyPickerOption {
  value: number;
  label: string;
}
