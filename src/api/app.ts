import getAxios from "./axios";

export default async function loadAppData() {
  const { data } = await getAxios().get<GetAppDataResponse>("/v2/app");
  return data;
}

export interface CountryWithCurrency {
  id: number;
  name: string;
  currency: {
    id: number;
    name: string;
    code: string;
  };
}

export interface Currency {
  id: number;
  name: string;
  code: string;
}

export interface GetAppDataResponse {
  countries: CountryWithCurrency[];
  users: User[];
  currencies: Currency[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}
