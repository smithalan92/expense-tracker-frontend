import App from "@/app/App.vue";
import { createAppRouter } from "@/app/router";
import { createTestingPinia } from "@pinia/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

// --- API mocks only ---
vi.mock("@/api/user", () => ({ login: vi.fn() }));
vi.mock("@/api/app", () => ({ default: vi.fn() }));
vi.mock("@/api/axios", () => ({ createInstance: vi.fn(), default: vi.fn() }));

vi.mock("@fortawesome/vue-fontawesome", () => ({
  FontAwesomeIcon: { template: "<span />" },
}));

import loadAppData from "@/api/app";
import { login } from "@/api/user";

const mockUser = { id: 1, firstName: "Alan", lastName: "Smith" };
const mockToken = { token: "test-token-abc", expiry: "2026-04-03T00:00:00Z" };
const mockAppData = {
  users: [mockUser],
  countries: [],
  currencies: [{ id: 1, name: "Euro", code: "EUR" }],
};

async function renderLogin() {
  const router = createAppRouter();

  render(App, {
    global: {
      plugins: [router, createTestingPinia({ stubActions: false })],
      stubs: { "fa-icon": true, Logo: { template: "<div />" } },
    },
  });

  await router.push("/login");
  return { router };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Login — UI", () => {
  it("renders email, password inputs and a Log In button", async () => {
    await renderLogin();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
  });

  it("Log In button is disabled when fields are empty", async () => {
    await renderLogin();

    expect(screen.getByRole("button", { name: "Log In" })).toBeDisabled();
  });

  it("Log In button is enabled once email and password are filled", async () => {
    await renderLogin();

    fireEvent.update(screen.getByPlaceholderText("Email"), "alan@example.com");
    fireEvent.update(screen.getByPlaceholderText("Password"), "password");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Log In" })).not.toBeDisabled();
    });
  });

  it("redirects to /trips after successful login", async () => {
    vi.mocked(login).mockResolvedValue({ user: mockUser, token: mockToken });
    vi.mocked(loadAppData).mockResolvedValue(mockAppData);

    const { router } = await renderLogin();

    fireEvent.update(screen.getByPlaceholderText("Email"), "alan@example.com");
    fireEvent.update(screen.getByPlaceholderText("Password"), "password");
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(router.currentRoute.value.path).toBe("/trips");
    });
  });

  it("shows error message on failed login", async () => {
    vi.mocked(login).mockRejectedValue(new Error("Invalid credentials"));

    await renderLogin();

    fireEvent.update(screen.getByPlaceholderText("Email"), "bad@example.com");
    fireEvent.update(screen.getByPlaceholderText("Password"), "wrong");
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid username or password")).toBeInTheDocument();
    });
  });
});
