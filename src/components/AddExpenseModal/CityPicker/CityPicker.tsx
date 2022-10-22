/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo } from "react";
import Select from "react-select";
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

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected ? "#fff" : "#000",
    }),
  };

  useEffect(() => {
    if (selectedCountryId) {
      dispatch(loadCitiesForCountry(selectedCountryId));
    }
  }, [selectedCountryId]);

  return (
    <Select
      className="flex-1"
      name="city"
      options={cityOptions}
      isSearchable={true}
      value={selectedCity}
      onChange={onSelectCity}
      styles={customStyles}
      isLoading={isLoadingCities}
      isDisabled={!selectedCountryId || isLoadingCities}
    />
  );
}
