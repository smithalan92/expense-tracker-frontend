/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectShouldShowAddExpenseModal,
  setShouldShowAddExpenseModal,
} from "@/store/slices/expenses";
import {
  loadCitiesForCountry,
  loadCountriesForTrip,
  resetState as resetNewExpenseState,
  selectCities,
  selectCountries,
  selectIsLoadingCities,
} from "@/store/slices/newExpense";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";

export default function AddExpenseModal() {
  const tripId = parseInt(useParams().tripId!, 10);
  const dispatch = useAppDispatch();
  const [selectedCountryId, setSelectedCountry] = useState<number | null>(98);
  const [selectedCity, setSelectedCity] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const shouldShowAddExpenseModal = useAppSelector(
    selectShouldShowAddExpenseModal
  );
  const countries = useAppSelector(selectCountries);

  const countryOptions = useMemo(() => {
    return countries.map((country) => ({
      value: country.id,
      label: country.name,
    }));
  }, [countries]);

  const selectedCountry = useMemo(() => {
    return countryOptions.find((c) => c.value === selectedCountryId);
  }, [countryOptions, selectedCountryId]);

  const cities = useAppSelector(selectCities);
  const isLoadingCities = useAppSelector(selectIsLoadingCities);

  const cityOptions = useMemo(() => {
    return cities.map((city) => ({
      value: city.id,
      label: city.name,
    }));
  }, [cities]);

  useEffect(() => {
    if (selectedCountryId) {
      dispatch(loadCitiesForCountry(selectedCountryId));
    }
  }, [selectedCountry]);

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected ? "#fff" : "#000",
    }),
  };

  useEffect(() => {
    dispatch(loadCountriesForTrip(tripId));
  }, []);

  return (
    <div className="flex w-full h-full absolute top-0 left-0 justify-center items-center bg-black/50">
      <div className="modal-box h-160 overflow-y-scroll absolute bottom-[-32px]">
        <h2 className="font-bold text-lg">Add Expense</h2>
        <div className="flex items-center py-4">
          <span className="w-24">Country</span>
          <Select
            className="flex-1"
            name="country"
            options={countryOptions}
            isSearchable={false}
            value={selectedCountry}
            onChange={(option) => setSelectedCountry(option!.value)}
            styles={customStyles}
          />
        </div>
        <div className="flex items-center py-4">
          <span className="w-24">City</span>
          <Select
            className="flex-1"
            name="city"
            options={cityOptions}
            isSearchable={true}
            value={selectedCity}
            onChange={setSelectedCity}
            styles={customStyles}
            isLoading={isLoadingCities}
            isDisabled={!selectedCountry || isLoadingCities}
            getOptionValue={(option) => `${option.value}`}
          />
        </div>
      </div>
    </div>
  );
}
