import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IRELAND_WITH_CURRENCY } from "../fixtures/countries_cities";
import { AED, EURO } from "../fixtures/currencies";
import { MOCK_TOKEN, USER_ONE } from "../fixtures/users";

vi.mock("@/api/app", () => ({
  default: vi.fn(),
}));

vi.mock("@/api/user", () => ({
  login: vi.fn(),
}));

vi.mock("@/api/axios", () => ({
  createInstance: vi.fn(),
  API_URL: "http://test.api",
}));

import loadAppData from "@/api/app";
import { createInstance } from "@/api/axios";
import { login } from "@/api/user";
import useAppStore from "@/store/appStore";

describe("appStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.resetAllMocks();
  });

  describe("gettters", () => {
    describe("isLoggedIn", () => {
      it("returns false when authToken is null", () => {
        const store = useAppStore();
        expect(store.isLoggedIn).toBe(false);
      });

      it("returns true when authToken is set", () => {
        const store = useAppStore();
        store.$patch({ authToken: "abc123" });
        expect(store.isLoggedIn).toBe(true);
      });
    });
  });

  describe("actions", () => {
    describe("loginUser", () => {
      it("sets user and authToken & loads app data on success", async () => {
        vi.mocked(login).mockResolvedValue({ user: USER_ONE, token: MOCK_TOKEN });
        vi.mocked(loadAppData).mockResolvedValue({
          users: [],
          countries: [],
          currencies: [],
          lastCurrencySyncDateTime: "",
        });

        const store = useAppStore();
        await store.loginUser({ email: "test@test.com", password: "password" });

        expect(loadAppData).toHaveBeenCalled();

        expect(store.user).toEqual(USER_ONE);
        expect(store.authToken).toBe(MOCK_TOKEN.token);
      });

      it("creates the axios instance with the token", async () => {
        vi.mocked(login).mockResolvedValue({ user: USER_ONE, token: MOCK_TOKEN });
        vi.mocked(loadAppData).mockResolvedValue({
          users: [],
          countries: [],
          currencies: [],
          lastCurrencySyncDateTime: "",
        });

        const store = useAppStore();
        await store.loginUser({ email: "test@test.com", password: "password" });

        expect(createInstance).toHaveBeenCalledWith(MOCK_TOKEN.token);
      });

      it("re-throws when login fails", async () => {
        vi.mocked(login).mockRejectedValue(new Error("Invalid credentials"));

        const store = useAppStore();
        await expect(store.loginUser({ email: "bad@test.com", password: "wrong" })).rejects.toThrow(
          "Invalid credentials",
        );

        expect(store.user).toBeNull();
        expect(store.authToken).toBeNull();
      });
    });

    describe("logout", () => {
      it("clears user, authToken and localstorage", () => {
        localStorage.setItem("some-key", "some-value");
        const store = useAppStore();
        store.$patch({ user: USER_ONE, authToken: "abc123" });

        store.logout();

        expect(store.user).toBeNull();
        expect(store.authToken).toBeNull();
        expect(localStorage.getItem("some-key")).toBeNull();
      });
    });

    describe("loadAppData", () => {
      it("sets users, countries and currencies from the API", async () => {
        const lastCurrencySyncDateTime = "2026-01-10 23:44:00";

        vi.mocked(loadAppData).mockResolvedValue({
          users: [USER_ONE],
          countries: [IRELAND_WITH_CURRENCY],
          currencies: [EURO, AED],
          lastCurrencySyncDateTime,
        });

        const store = useAppStore();
        await store.loadAppData();

        expect(store.users).toEqual([USER_ONE]);
        expect(store.countries).toEqual([IRELAND_WITH_CURRENCY]);
        expect(store.currencies).toEqual([EURO, AED]);
        expect(store.lastCurrencySyncDateTime).toEqual(lastCurrencySyncDateTime);
      });
    });
  });
});
