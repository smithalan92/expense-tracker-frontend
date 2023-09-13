import { loadCitiesForCountry } from "@/api";
import { City } from "@/api.types";
import { ReactComponent as CheckIcon } from "@/assets/check.svg";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [cities, setCities] = useState<Omit<City, "timezoneName">[]>([]);
  // const [selectedCityIds, setSelectedCityIds] = useState<number[]>(cityIds);
  const [shouldOnlyDisplaySelectedCities, setShouldOnlyDisplaySelectedCities] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const citiesToDisplay = useMemo(() => {
    if (shouldOnlyDisplaySelectedCities) {
      return cities.filter((city) => {
        const matchesSearch =
          searchTerm.trim().length > 0
            ? city.name.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        return selectedCityIds.includes(city.id) && matchesSearch;
      });
    }

    if (searchTerm) {
      return cities.filter((city) => {
        return city.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    return cities;
  }, [shouldOnlyDisplaySelectedCities, searchTerm, cities, selectedCityIds]);

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
          className="w-full p-2 rounded bg-white border border-solid border-gray-200"
          placeholder="Search for a city"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex justify-between flex-wrap h-[180px] overflow-scroll">
        {citiesToDisplay.length === 0 && shouldOnlyDisplaySelectedCities && (
          <span className="text-center">No cities have been selected</span>
        )}
        {citiesToDisplay.map((city) => {
          const isSelected = selectedCityIds.includes(city.id);
          return (
            <div
              className="flex items-center justify-between w-1/2 h-12 overflow-hidden px-2 py-4 hover:opacity-70 cursor-pointer"
              key={city.id}
              onClick={() => onClickCity(city.id)}
            >
              <span
                className={`truncate ${isSelected ? "text-green-600" : ""}`}
              >
                {city.name}
              </span>
              {isSelected && (
                <span className="ml-2">
                  <CheckIcon className="w-6 fill-green-600" />
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center">
        <button
          className="underline"
          onClick={() =>
            setShouldOnlyDisplaySelectedCities(!shouldOnlyDisplaySelectedCities)
          }
        >
          View{" "}
          {shouldOnlyDisplaySelectedCities
            ? "all cities"
            : "selected cities only"}
        </button>
      </div>
    </div>
  );
}
