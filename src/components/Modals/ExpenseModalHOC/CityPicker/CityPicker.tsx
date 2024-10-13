import Picker from "@/components/widgets/Picker/Picker";
import { useAppSelector } from "@/store";
import { selectCitiesForCountryId } from "@/store/slices/tripData";
import { useEffect, useMemo } from "react";

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
  }, [cities]);

  const selectedCity = useMemo(() => {
    if (!value) return null;
    return cityOptions.find((c) => c.value === value);
  }, [cityOptions, value]);

  // This ensures the city is reset when the country changes after picking a city
  useEffect(() => {
    if (selectedCountryId && selectedCity?.countryId !== selectedCountryId) {
      onChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryId]);

  useEffect(() => {
    if (cities.length === 1) {
      onChange(cities[0].id);
    }
  }, [cities, onChange]);

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

export interface CityPickerProps {
  value: number | null;
  selectedCountryId: number | null;
  onChange: (selectedId: number | null) => void;
}

export interface CityPickerOption {
  countryId: number;
  value: number;
  label: string;
}
