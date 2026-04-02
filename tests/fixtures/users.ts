import type { LoginToken, LoginUser } from "@/api/user";

export const USER_ONE: LoginUser = {
  id: 1,
  firstName: "One",
  lastName: "User",
};

export const USER_TWO: LoginUser = {
  id: 3,
  firstName: "Two",
  lastName: "User",
};

export const MOCK_TOKEN: LoginToken = { token: "test-token-abc", expiry: "2026-04-03T00:00:00Z" };
