import axios from "axios";
import { API_URL } from "./axios";
import { CLIENT_ID, CLIENT_ID_HEADER } from "./clientId";

export async function login({ email, password }: { email: string; password: string }) {
  const { data } = await axios.post<LoginResponse>(
    `${API_URL}/v2/login`,
    { email, password },
    { headers: { [CLIENT_ID_HEADER]: CLIENT_ID } },
  );

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
