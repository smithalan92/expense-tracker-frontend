import axios, { AxiosInstance } from "axios";
import { GetTripsResponse, LoginResponse } from "./api.types";

let http: AxiosInstance | null = null;

// TODO - Correct url
const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:3520" : "";

export function createInstance(authToken: string) {
  http = axios.create({
    baseURL: API_URL,
    headers: { Authorization: authToken },
  });
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data } = await axios.post<LoginResponse>(`${API_URL}/login`, {
    email,
    password,
  });

  return data;
}

export async function getTrips() {
  const { data } = await http!.get<GetTripsResponse>("/trips");

  return data.trips;
}
