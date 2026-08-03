import usePullToRefresh from "@/components/trip/hooks/usePullToRefresh";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

// jsdom has no TouchEvent, and the hook only ever reads clientX/clientY off the
// touches list, so a plain Event with the list attached is enough.
function touchEvent(type: string, touches: { clientX: number; clientY: number }[]) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "touches", { value: touches });
  return event;
}

const START = { clientX: 100, clientY: 100 };

function moveTo(el: HTMLElement, x: number, y: number) {
  el.dispatchEvent(touchEvent("touchmove", [{ clientX: x, clientY: y }]));
}

describe("usePullToRefresh", () => {
  let el: HTMLElement;
  let scrollTop: number;

  beforeEach(() => {
    el = document.createElement("div");
    scrollTop = 0;
    Object.defineProperty(el, "scrollTop", { get: () => scrollTop });
    document.body.appendChild(el);
  });

  function setup(onRefresh = vi.fn().mockResolvedValue(undefined)) {
    const scrollEl = ref<HTMLElement | null>(el);
    return { onRefresh, ...usePullToRefresh(scrollEl, onRefresh) };
  }

  it("opens the indicator as the finger moves down, with resistance", () => {
    const { pullDistance } = setup();

    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 100, 200);

    // 100px of finger travel at 0.5 resistance
    expect(pullDistance.value).toBe(50);
  });

  it("caps how far the indicator can be pulled open", () => {
    const { pullDistance } = setup();

    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 100, 2000);

    expect(pullDistance.value).toBe(110);
  });

  it("arms once the pull passes the threshold", () => {
    const { isArmed } = setup();

    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 100, 200);
    expect(isArmed.value).toBe(false);

    moveTo(el, 100, 300);
    expect(isArmed.value).toBe(true);
  });

  it("refreshes when released past the threshold", async () => {
    const { onRefresh, isRefreshing, pullDistance } = setup();

    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 100, 300);
    el.dispatchEvent(touchEvent("touchend", []));

    expect(isRefreshing.value).toBe(true);

    await vi.waitFor(() => expect(isRefreshing.value).toBe(false));

    expect(onRefresh).toHaveBeenCalledOnce();
    expect(pullDistance.value).toBe(0);
  });

  it("snaps back without refreshing when released below the threshold", async () => {
    const { onRefresh, pullDistance } = setup();

    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 100, 200);
    el.dispatchEvent(touchEvent("touchend", []));

    expect(onRefresh).not.toHaveBeenCalled();
    expect(pullDistance.value).toBe(0);
  });

  it("resets the indicator when the refresh fails", async () => {
    const onRefresh = vi.fn().mockRejectedValue(new Error("nope"));
    const { isRefreshing, pullDistance } = setup(onRefresh);

    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 100, 300);
    el.dispatchEvent(touchEvent("touchend", []));

    await vi.waitFor(() => expect(isRefreshing.value).toBe(false));

    expect(pullDistance.value).toBe(0);
  });

  it("ignores the gesture when the list is not scrolled to the top", () => {
    const { pullDistance } = setup();
    scrollTop = 40;

    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 100, 300);

    expect(pullDistance.value).toBe(0);
  });

  it("ignores upward drags", () => {
    const { pullDistance } = setup();

    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 100, 20);

    expect(pullDistance.value).toBe(0);
  });

  it("ignores horizontal swipes", () => {
    const { pullDistance } = setup();

    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 300, 120);

    expect(pullDistance.value).toBe(0);
  });

  it("does not start a new pull while a refresh is in flight", async () => {
    let resolveRefresh: () => void;
    const onRefresh = vi.fn(() => new Promise<void>((resolve) => (resolveRefresh = resolve)));
    const { isRefreshing, pullDistance } = setup(onRefresh);

    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 100, 300);
    el.dispatchEvent(touchEvent("touchend", []));

    expect(isRefreshing.value).toBe(true);

    // A second pull while the first is still running must not move the indicator
    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 100, 400);
    expect(pullDistance.value).toBe(70);

    resolveRefresh!();
    await vi.waitFor(() => expect(isRefreshing.value).toBe(false));

    expect(onRefresh).toHaveBeenCalledOnce();
  });

  it("prevents the container scrolling once it commits to a pull", () => {
    setup();

    el.dispatchEvent(touchEvent("touchstart", [START]));

    const move = touchEvent("touchmove", [{ clientX: 100, clientY: 200 }]);
    el.dispatchEvent(move);

    expect(move.defaultPrevented).toBe(true);
  });

  it("abandons the gesture when the touch is cancelled", () => {
    const { pullDistance } = setup();

    el.dispatchEvent(touchEvent("touchstart", [START]));
    moveTo(el, 100, 300);
    el.dispatchEvent(touchEvent("touchcancel", []));

    expect(pullDistance.value).toBe(0);
  });
});
