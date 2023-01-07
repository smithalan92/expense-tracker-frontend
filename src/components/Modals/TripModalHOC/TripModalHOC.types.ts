export interface TripModalData {
  file?: File;
  name: string;
  startDate: string;
  endDate: string;
  countryIds: number[];
  userIds: number[];
}

export interface TripModalHOCProps {
  title: string;
  footer: JSX.Element | JSX.Element[];
  onChangeData: (data: TripModalData) => void;
}
