import ImagePicker from "@/components/widgets/ImagePicker/ImagePicker";
import React, { ChangeEvent, useEffect, useState } from "react";
import { TripModalHOCProps } from "./TripModalHOC.types";
import CustomDatePicker from "../../widgets/DatePicker/DatePicker";
import { formatDateForTrip } from "@/utils/date";
import { addDays } from "date-fns";
import Picker from "@/components/widgets/Picker/Picker";
import { PickerOption } from "@/components/widgets/Picker/Picker.types";
import * as api from "@/api";
import { useAppSelector } from "@/store";
import { selectUser } from "@/store/slices/app";

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
  const [countryPickerOptions, setCountryPickerOptions] = useState<
    PickerOption[]
  >([]);

  const [selectedCountryIds, setSelectedCountryIds] = useState<number[]>([]);

  const [userPickerOptions, setUserPickerOptions] = useState<PickerOption[]>(
    []
  );
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  useEffect(() => {
    const loadData = async () => {
      const [countries, users] = await Promise.all([
        api.loadCountries(),
        api.loadUsers(),
      ]);

      setCountryPickerOptions(
        countries.map((c) => ({
          value: c.id,
          label: c.name,
        }))
      );
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
  }, []);

  useEffect(() => {
    onChangeData({
      file: selectedImage ?? undefined,
      name,
      startDate,
      endDate,
      countryIds: selectedCountryIds,
      userIds: selectedUserIds,
    });
  }, [
    selectedImage,
    name,
    startDate,
    endDate,
    selectedCountryIds,
    selectedUserIds,
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
            <Picker
              options={countryPickerOptions}
              value={selectedCountryIds}
              onChange={setSelectedCountryIds}
              isMulti={true}
            />
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
    </div>
  );
}
