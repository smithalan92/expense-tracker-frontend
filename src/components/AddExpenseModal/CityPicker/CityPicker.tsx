/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  loadCitiesForCountry,
  selectCities,
  selectIsLoadingCities,
  selectSelectedCityId,
  selectSelectedCountryId,
  setSelectedCityId,
} from "@/store/slices/newExpense";
import { CityPickerOption } from "./CityPicker.types";
import CustomSelect from "@/components/CustomSelect/CustomSelect";

export default function CityPicker() {
  const dispatch = useAppDispatch();
  const selectedCountryId = useAppSelector(selectSelectedCountryId);
  const selectedCityId = useAppSelector(selectSelectedCityId);
  const cities = useAppSelector(selectCities);
  const isLoadingCities = useAppSelector(selectIsLoadingCities);

  const onSelectCity = useCallback(
    (option: CityPickerOption | null) => {
      dispatch(setSelectedCityId(option!.value));
    },
    [dispatch]
  );

  const cityOptions = useMemo(() => {
    return cities.map<CityPickerOption>((city) => ({
      value: city.id,
      label: city.name,
    }));
  }, [cities]);

  const selectedCity = useMemo(() => {
    if (!selectedCityId) return null;
    return cityOptions.find((c) => c.value === selectedCityId);
  }, [cityOptions, selectedCityId]);

  useEffect(() => {
    if (selectedCountryId) {
      dispatch(loadCitiesForCountry(selectedCountryId));
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
      isLoading={isLoadingCities}
      isDisabled={!selectedCountryId || isLoadingCities}
    />
  );
}
