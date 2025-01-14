import axios from "axios";
import { API_URL } from "./axios";

export async function login({ email, password }: { email: string; password: string }) {
  const { data } = await axios.post<LoginResponse>(`${API_URL}/v2/login`, {
    email,
    password,
  });

  return data;
}

export interface LoginResponse {
  user: LoginUser;
  token: LoginToken;
}

export interface LoginUser {
  id: number;
  firstName: string;
  lastName: string;
}

export interface LoginToken {
  expiry: string;
  token: string;
}
