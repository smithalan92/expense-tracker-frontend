import getAxios from "./axios";
import type { User } from "./user";

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
