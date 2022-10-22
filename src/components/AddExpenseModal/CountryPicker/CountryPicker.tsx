/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from "react";
import Select from "react-select";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectCountries,
  selectSelectedCountryId,
  setSelectedCountryId,
} from "@/store/slices/newExpense";
import { CountryPickerOption } from "./CountryPicker.types";

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

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected ? "#fff" : "#000",
    }),
  };

  return (
    <Select
      className="flex-1"
      name="country"
      options={countryOptions}
      isSearchable={false}
      value={selectedCountry}
      onChange={onSelectCountry}
      styles={customStyles}
    />
  );
}
