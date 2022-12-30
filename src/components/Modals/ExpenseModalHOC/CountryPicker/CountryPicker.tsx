/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from "react";
import { useAppSelector } from "@/store";
import { selectCountries } from "@/store/slices/tripData";
import { CountryPickerOption, CountryPickerProps } from "./CountryPicker.types";
import CustomSelect from "@/components/widgets/CustomSelect/CustomSelect";

export default function CountryPicker({ value, onChange }: CountryPickerProps) {
  const countries = useAppSelector(selectCountries);

  const onSelectCountry = useCallback(
    (option: CountryPickerOption | null) => {
      onChange(option!.value);
    },
    [onChange]
  );

  const countryOptions = useMemo(() => {
    return countries.map<CountryPickerOption>((country) => ({
      value: country.id,
      label: country.name,
    }));
  }, [countries]);

  const selectedCountry = useMemo(() => {
    return countryOptions.find((c) => c.value === value);
  }, [countryOptions, value]);

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
