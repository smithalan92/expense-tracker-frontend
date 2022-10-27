import { useCallback, useEffect, useMemo } from "react";
import { useAppSelector } from "@/store";
import { CityPickerOption, CityPickerProps } from "./CityPicker.types";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { selectCitiesForCountryId } from "@/store/slices/tripData";

export default function CityPicker({
  value,
  selectedCountryId,
  onChange,
}: CityPickerProps) {
  const cities = useAppSelector((state) =>
    selectCitiesForCountryId(state, selectedCountryId)
  );

  const onSelectCity = useCallback(
    (option: CityPickerOption | null) => {
      onChange(option!.value);
    },
    [onChange]
  );

  const cityOptions = useMemo(() => {
    return cities.map<CityPickerOption>((city) => ({
      value: city.id,
      label: city.name,
    }));
  }, [cities, selectedCountryId]);

  const selectedCity = useMemo(() => {
    if (!value) return null;
    return cityOptions.find((c) => c.value === value);
  }, [cityOptions, value]);

  useEffect(() => {
    if (selectedCountryId && value) {
      onChange(null);
    }
  }, [selectedCountryId]);

  return (
    <CustomSelect
      className="flex-1"
      name="city"
      options={cityOptions}
      isSearchable={true}
      value={selectedCity}
      onChange={onSelectCity}
      isDisabled={!selectedCountryId}
    />
  );
}
