import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/axios", () => ({ API_URL: "http://api" }));
vi.mock("@microsoft/fetch-event-source", () => ({
  EventStreamContentType: "text/event-stream",
  fetchEventSource: vi.fn(() => new Promise(() => {})),
}));

import { subscribeToTripEvents } from "@/api/events";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const mockFetchEventSource = vi.mocked(fetchEventSource);

const OPTIONS = { authToken: "token", onEvent: vi.fn(), onUnauthorized: vi.fn() };

describe("subscribeToTripEvents", () => {
  beforeEach(() => {
    mockFetchEventSource.mockClear();
  });

  it("opens the stream with the auth token, leaving visibility to the caller", () => {
    subscribeToTripEvents(OPTIONS);

    expect(mockFetchEventSource).toHaveBeenCalledTimes(1);
    expect(mockFetchEventSource.mock.calls[0]![0]).toBe("http://api/v2/events");
    expect(mockFetchEventSource.mock.calls[0]![1]).toMatchObject({
      openWhenHidden: true,
      headers: { Authorization: "token", "X-Client-Id": expect.any(String) },
    });
  });

  it("aborts the stream when unsubscribed", () => {
    const unsubscribe = subscribeToTripEvents(OPTIONS);
    const signal = mockFetchEventSource.mock.calls[0]![1].signal!;

    expect(signal.aborted).toBe(false);
    unsubscribe();
    expect(signal.aborted).toBe(true);
  });
});
