import * as api from "@/api";
import { ReactComponent as XIcon } from "@/assets/close.svg";
import ImagePicker from "@/components/widgets/ImagePicker/ImagePicker";
import Picker from "@/components/widgets/Picker/Picker";
import { PickerOption } from "@/components/widgets/Picker/Picker.types";
import { useAppSelector } from "@/store";
import { selectUser } from "@/store/slices/app";
import { formatDateForTrip } from "@/utils/date";
import { addDays } from "date-fns";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import CustomDatePicker from "../../widgets/DatePicker/DatePicker";
import AddCountryModal from "../AddCountryModal/AddCountryModal";
import { TripModalCountry, TripModalHOCProps } from "./TripModalHOC.types";

export default function ExpenseModalHOC({
  title,
  footer,
  onChangeData,
}: TripModalHOCProps) {
  const currentUser = useAppSelector(selectUser)!;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(formatDateForTrip(new Date()));
  const [endDate, setEndDate] = useState(
    formatDateForTrip(addDays(new Date(), 1))
  );

  const [selectedCountries, setSelectedCountries] = useState<
    TripModalCountry[]
  >([]);

  const [userPickerOptions, setUserPickerOptions] = useState<PickerOption[]>(
    []
  );
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const [countryModalData, setCountryModalData] =
    useState<TripModalCountry | null>(null);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const openAddCountryPicker = useCallback(() => {
    setIsCountryPickerOpen(true);
  }, []);

  const onSaveCountry = useCallback(
    (country: TripModalCountry) => {
      const newCountries = selectedCountries.filter(
        (c) => c.countryId !== country.countryId
      );
      setSelectedCountries([...newCountries, country]);
    },
    [selectedCountries]
  );

  const onClickOpenCountry = useCallback(
    (countryId: number) => {
      const country = selectedCountries.find((c) => c.countryId === countryId)!;
      setCountryModalData(country);
      openAddCountryPicker();
    },
    [openAddCountryPicker, selectedCountries]
  );

  const onClickDeleteCountry = useCallback(
    (countryId: number) => {
      setSelectedCountries(
        selectedCountries.filter((c) => c.countryId !== countryId)
      );
    },
    [selectedCountries]
  );

  const onCloseCountryModal = useCallback(() => {
    setIsCountryPickerOpen(false);
    setCountryModalData(null);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const users = await api.loadUsers();

      setUserPickerOptions(
        users
          .filter((u) => u.id !== currentUser.id)
          .map((u) => ({
            value: u.id,
            label: `${u.firstName} ${u.lastName}`,
          }))
      );
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChangeData({
      file: selectedImage ?? undefined,
      name,
      startDate,
      endDate,
      countries: selectedCountries,
      userIds: selectedUserIds,
    });
  }, [
    selectedImage,
    name,
    startDate,
    endDate,
    selectedCountries,
    selectedUserIds,
    onChangeData,
  ]);

  return (
    <div className="et-modal-backdrop overflow-hidden">
      <div className="animate-slide-in-bottom et-modal overflow-hidden absolute bottom-0 md:relative box-content w-[350px] md:w-full">
        <h2 className="font-bold text-2xl mb-2">{title}</h2>
        <div className="h-[450px] overflow-y-scroll pr-4">
          <div className="flex items-center py-4">
            <span className="w-24">Image</span>
            <ImagePicker onChange={setSelectedImage} />
          </div>
          <div className="flex items-center py-4">
            <span className="w-24">Name</span>
            <input
              className="flex-1 input input-md input-bordered rounded-md w-32 bg-white text-black"
              placeholder="Trip to Fiji"
              value={name}
              onChange={onChangeName}
            />
          </div>
          <div className="flex items-center py-4">
            <span className="w-24">Start Date</span>
            <CustomDatePicker
              value={startDate}
              dateStringFormatter={formatDateForTrip}
              useDateOnly={true}
              onChange={setStartDate}
            />
          </div>
          <div className="flex items-center py-4">
            <span className="w-24">End Date</span>
            <CustomDatePicker
              value={endDate}
              dateStringFormatter={formatDateForTrip}
              useDateOnly={true}
              onChange={setEndDate}
            />
          </div>
          <div className="flex items-center py-4">
            <span className="w-24">Countries</span>
            <div className="ml-2 flex flex-wrap">
              {selectedCountries.map((country) => {
                return (
                  <div
                    className="flex select-none items-center ml-1 bg-blue-400 rounded text-white mr-2"
                    key={country.countryId}
                  >
                    <button
                      className="p-2 "
                      onClick={() => onClickOpenCountry(country.countryId)}
                    >
                      {country.name}
                    </button>
                    <button
                      className="p-2 hover:opacity-60 cursor-pointer"
                      onClick={() => onClickDeleteCountry(country.countryId)}
                    >
                      <XIcon className="w-2 ml-2" />
                    </button>
                  </div>
                );
              })}
              <button onClick={openAddCountryPicker}>Add Country</button>
            </div>
          </div>
          <div className="flex items-center py-4">
            <span className="w-24">Users</span>
            <Picker
              options={userPickerOptions}
              value={selectedUserIds}
              onChange={setSelectedUserIds}
              isMulti={true}
            />
          </div>
        </div>
        <div>{footer}</div>
      </div>
      {isCountryPickerOpen && (
        <AddCountryModal
          initalData={countryModalData}
          onSave={onSaveCountry}
          onClose={onCloseCountryModal}
        />
      )}
    </div>
  );
}
