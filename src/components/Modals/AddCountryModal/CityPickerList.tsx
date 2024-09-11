import { loadCitiesForCountry } from "@/api";
import { City as CityType } from "@/api.types";
import { useCallback, useEffect, useMemo, useState } from "react";
import City from "./City";
import SelectedCitiesPopUp from "./SelectedCitiesPopup";

export interface OnClickCityProps {
  op: "add" | "remove";
  cityId: number;
}

export interface CityPickerListProps {
  countryId: number;
  cityIds: number[];
  onSelectCity: ({ op, cityId }: OnClickCityProps) => void;
}

export default function CityPickerList({
  countryId,
  onSelectCity,
  cityIds: selectedCityIds,
}: CityPickerListProps) {
  const [cities, setCities] = useState<Omit<CityType, "timezoneName">[]>([]);
  // const [selectedCityIds, setSelectedCityIds] = useState<number[]>(cityIds);
  const [isSelectedCitiesPopupOpen, setIsSelectedCitiesPopupOpen] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const citiesToDisplay = useMemo(() => {
    if (searchTerm) {
      return cities.filter((city) => {
        return city.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    return cities;
  }, [searchTerm, cities]);

  const selectedCities = useMemo(() => {
    return selectedCityIds.map((id) => cities.find((city) => city.id === id)!);
  }, [selectedCityIds, cities]);

  const loadCityOptions = async () => {
    const cities = await loadCitiesForCountry(countryId);
    setCities(cities);
  };

  const onClickCity = useCallback(
    (cityId: number) => {
      if (selectedCityIds.includes(cityId)) {
        onSelectCity({ op: "remove", cityId });
      } else {
        onSelectCity({ op: "add", cityId });
      }
    },
    [onSelectCity, selectedCityIds]
  );

  useEffect(() => {
    setCities([]);
    loadCityOptions();
    setSearchTerm("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  return (
    <div className="flex flex-col">
      <span className="mb-2 font-bold">Pick the cities you will visit</span>
      <span className="mb-2 text-sm">
        If you dont select any you will be able to choose any of them when
        adding an expense.
      </span>
      <div className="my-2">
        <input
          type="search"
          className="w-full p-2 rounded bg-white border border-solid border-gray-200"
          placeholder="Search for a city"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex justify-between flex-wrap h-[180px] overflow-scroll">
        {citiesToDisplay.length === 0 && searchTerm && (
          <span>No cities match your search term</span>
        )}
        {citiesToDisplay.map((city) => {
          const isSelected = selectedCityIds.includes(city.id);
          return (
            <div className="w-1/2" key={city.id}>
              <City city={city} isSelected={isSelected} onClick={onClickCity} />
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center">
        {selectedCityIds.length > 0 && (
          <button
            className="underline"
            onClick={() => setIsSelectedCitiesPopupOpen(true)}
          >
            View Selected Cities
          </button>
        )}
      </div>
      {isSelectedCitiesPopupOpen && (
        <SelectedCitiesPopUp
          selectedCities={selectedCities}
          onClickCity={onClickCity}
          onClose={() => setIsSelectedCitiesPopupOpen(false)}
        />
      )}
    </div>
  );
}
