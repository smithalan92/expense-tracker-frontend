import { CreateTripCountry, GetTripEditDataResponse } from "@/api.types";

export interface TripModalCountry extends CreateTripCountry {
  name: string;
}

export interface TripModalData {
  file?: File;
  name: string;
  startDate: string;
  endDate: string;
  countries: TripModalCountry[];
  userIds: number[];
}

export interface TripModalHOCProps {
  title: string;
  footer: JSX.Element | JSX.Element[];
  initalData?: GetTripEditDataResponse | null;
  onChangeData: (data: TripModalData) => void;
}
