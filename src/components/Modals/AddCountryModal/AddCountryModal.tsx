import { loadCountries } from "@/api";
import Picker from "@/components/widgets/Picker/Picker";
import { PickerOption } from "@/components/widgets/Picker/Picker.types";
import { useCallback, useEffect, useState } from "react";
import { TripModalCountry } from "../TripModalHOC/TripModalHOC.types";
import CityPickerList, { OnClickCityProps } from "./CityPickerList";

export interface AddCountryModalProps {
  onClose: () => void;
  onSave: (country: TripModalCountry) => void;
  initalData: TripModalCountry | null;
}

export default function AddCountryModal({
  onClose,
  onSave,
  initalData,
}: AddCountryModalProps) {
  const [countryPickerOptions, setCountryPickerOptions] = useState<
    PickerOption[]
  >([]);

  const [selectedCountryId, setSelectedCountryId] = useState(
    initalData?.countryId || 0
  );
  const [selectedCityIds, setSelectedCityIds] = useState<number[]>(
    initalData?.cityIds ?? []
  );

  const onSelectCity = useCallback(
    ({ op, cityId }: OnClickCityProps) => {
      if (op === "remove") {
        setSelectedCityIds(selectedCityIds.filter((id) => id !== cityId));
      }

      if (op === "add") {
        setSelectedCityIds([...selectedCityIds, cityId]);
      }
    },
    [selectedCityIds]
  );

  const onSelectCountry = useCallback((countryId: number) => {
    setSelectedCountryId(countryId);
  }, []);

  const onClickCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const onClickSave = useCallback(() => {
    const data: TripModalCountry = {
      countryId: selectedCountryId,
      name: countryPickerOptions.find((c) => c.value === selectedCountryId)!
        .label,
    };

    if (selectedCityIds.length) {
      data.cityIds = selectedCityIds;
    }

    onSave(data);
    onClose();
  }, [
    countryPickerOptions,
    onClose,
    onSave,
    selectedCityIds,
    selectedCountryId,
  ]);

  useEffect(() => {
    loadCountries().then((countries) => {
      setCountryPickerOptions(
        countries.map((c) => ({
          value: c.id,
          label: c.name,
        }))
      );
    });
  }, []);

  return (
    <div className="et-modal-backdrop overflow-hidden">
      <div className="animate-slide-in-bottom et-modal overflow-hidden absolute bottom-0 md:relative box-content w-[350px] md:w-full">
        <h2 className="font-bold text-2xl mb-2">Add a Country</h2>
        <div className="min-h-[500px] overflow-hidden pr-4">
          <div className="flex flex-col py-4">
            <span className="mb-4 font-bold">Pick a country</span>
            <Picker
              options={countryPickerOptions}
              value={selectedCountryId}
              onChange={onSelectCountry}
              isMulti={false}
            />
          </div>
          {selectedCountryId > 0 && (
            <div className="flex flex-col py-4">
              <CityPickerList
                countryId={selectedCountryId}
                cityIds={selectedCityIds}
                onSelectCity={onSelectCity}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end pt-6">
          <button
            className="btn btn-secondary font-bold text-md mr-4"
            onClick={onClickCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary font-bold text-md"
            onClick={onClickSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
