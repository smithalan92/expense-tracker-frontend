import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/store";
import { CityPickerOption, CityPickerProps } from "./CityPicker.types";
import { selectCitiesForCountryId } from "@/store/slices/tripData";
import Picker from "@/components/widgets/Picker/Picker";

export default function CityPicker({
  value,
  selectedCountryId,
  onChange,
}: CityPickerProps) {
  const cities = useAppSelector((state) =>
    selectCitiesForCountryId(state, selectedCountryId)
  );

  const cityOptions = useMemo(() => {
    return cities.map<CityPickerOption>((city) => ({
      countryId: city.countryId,
      value: city.id,
      label: city.name,
    }));
  }, [cities, selectedCountryId]);

  const selectedCity = useMemo(() => {
    if (!value) return null;
    return cityOptions.find((c) => c.value === value);
  }, [cityOptions, value]);

  // This ensures the city is reset when the country changes after picking a city
  useEffect(() => {
    if (selectedCountryId && selectedCity?.countryId !== selectedCountryId) {
      onChange(null);
    }
  }, [selectedCountryId]);

  return (
    <Picker
      options={cityOptions}
      value={value}
      onChange={onChange}
      isMulti={false}
      // isDisabled={!selectedCountryId}
    />
  );
}
