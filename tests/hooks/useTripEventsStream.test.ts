import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { effectScope, nextTick, type EffectScope } from "vue";

vi.mock("@/api/events", () => ({ subscribeToTripEvents: vi.fn() }));
vi.mock("@/api/axios", () => ({ createInstance: vi.fn(), default: vi.fn() }));

import { subscribeToTripEvents } from "@/api/events";
import useAppStore from "@/store/appStore";
import useTripEventsStream from "@/store/useTripEventsStream";

const mockSubscribe = vi.mocked(subscribeToTripEvents);
let unsubscribes: ReturnType<typeof vi.fn>[];

function setVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state });
  document.dispatchEvent(new Event("visibilitychange"));
}

function runHook() {
  const scope = effectScope();
  scope.run(() => useTripEventsStream());
  return scope;
}

describe("useTripEventsStream", () => {
  let scope: EffectScope;

  beforeEach(() => {
    setActivePinia(createPinia());
    setVisibility("visible");
    unsubscribes = [];
    mockSubscribe.mockReset().mockImplementation(() => {
      const unsubscribe = vi.fn();
      unsubscribes.push(unsubscribe);
      return unsubscribe;
    });
    scope?.stop();
  });

  it("doesn't connect when logged out", () => {
    scope = runHook();
    expect(mockSubscribe).not.toHaveBeenCalled();
  });

  it("connects when logged in and visible", () => {
    useAppStore().authToken = "token";
    scope = runHook();

    expect(mockSubscribe).toHaveBeenCalledTimes(1);
    expect(mockSubscribe.mock.calls[0]![0].authToken).toBe("token");
  });

  it("closes when hidden and reconnects when visible again", async () => {
    useAppStore().authToken = "token";
    scope = runHook();

    setVisibility("hidden");
    await nextTick();
    expect(unsubscribes[0]).toHaveBeenCalled();
    expect(mockSubscribe).toHaveBeenCalledTimes(1);

    setVisibility("visible");
    await nextTick();
    expect(mockSubscribe).toHaveBeenCalledTimes(2);
  });

  it("doesn't connect while starting hidden", () => {
    setVisibility("hidden");
    useAppStore().authToken = "token";
    scope = runHook();

    expect(mockSubscribe).not.toHaveBeenCalled();
  });

  it("closes on logout and reconnects with the new token on login", async () => {
    const appStore = useAppStore();
    appStore.authToken = "old";
    scope = runHook();

    appStore.authToken = null;
    await nextTick();
    expect(unsubscribes[0]).toHaveBeenCalled();

    appStore.authToken = "new";
    await nextTick();
    expect(mockSubscribe).toHaveBeenCalledTimes(2);
    expect(mockSubscribe.mock.calls[1]![0].authToken).toBe("new");
  });

  it("doesn't connect when SSE updates are turned off", () => {
    const appStore = useAppStore();
    appStore.authToken = "token";
    appStore.setUseSSEUpdates(false);
    scope = runHook();

    expect(mockSubscribe).not.toHaveBeenCalled();
  });

  it("closes when SSE updates are turned off and reconnects when turned back on", async () => {
    const appStore = useAppStore();
    appStore.authToken = "token";
    scope = runHook();

    appStore.setUseSSEUpdates(false);
    await nextTick();
    expect(unsubscribes[0]).toHaveBeenCalled();
    expect(mockSubscribe).toHaveBeenCalledTimes(1);

    appStore.setUseSSEUpdates(true);
    await nextTick();
    expect(mockSubscribe).toHaveBeenCalledTimes(2);
  });

  it("closes when the scope is disposed", () => {
    useAppStore().authToken = "token";
    scope = runHook();

    scope.stop();
    expect(unsubscribes[0]).toHaveBeenCalled();
  });
});
