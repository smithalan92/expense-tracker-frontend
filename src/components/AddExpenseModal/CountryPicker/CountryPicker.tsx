/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectCountries,
  selectSelectedCountryId,
  setSelectedCountryId,
} from "@/store/slices/newExpense";
import { CountryPickerOption } from "./CountryPicker.types";
import CustomSelect from "@/components/CustomSelect/CustomSelect";

export default function CountryPicker() {
  const dispatch = useAppDispatch();
  const selectedCountryId = useAppSelector(selectSelectedCountryId);
  const countries = useAppSelector(selectCountries);

  const onSelectCountry = useCallback(
    (option: CountryPickerOption | null) => {
      dispatch(setSelectedCountryId(option!.value));
    },
    [dispatch]
  );

  const countryOptions = useMemo(() => {
    return countries.map<CountryPickerOption>((country) => ({
      value: country.id,
      label: country.name,
    }));
  }, [countries]);

  const selectedCountry = useMemo(() => {
    return countryOptions.find((c) => c.value === selectedCountryId);
  }, [countryOptions, selectedCountryId]);

  return (
    <CustomSelect
      className="flex-1"
      name="country"
      options={countryOptions}
      isSearchable={false}
      value={selectedCountry}
      onChange={onSelectCountry}
    />
  );
}
