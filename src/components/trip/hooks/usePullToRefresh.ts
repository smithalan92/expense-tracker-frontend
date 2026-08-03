import { computed, ref, watch, type Ref } from "vue";

/*
  Pull down from the top of a scroll container to refresh it.

  Touch events rather than pointer events: the browser fires pointercancel as soon as it
  claims a gesture for scrolling, so a pointer-based version loses the drag halfway through.
  A non-passive touchmove lets us preventDefault once we've decided the gesture is a pull.
  Mouse dragging is deliberately not supported - this is a touch affordance.

  `pullDistance` is how far the indicator should be opened, in pixels. Drive the height of a
  spacer at the top of the scroll container with it rather than a transform: the expense list
  has `sticky` date headers, and a transform on an ancestor would break their positioning.

  `isDragging` is false while the indicator is snapping back, so the caller can transition the
  height then but not while the finger is down.
*/

const THRESHOLD_PX = 70;
const MAX_PULL_PX = 110;
// The pull follows the finger at less than 1:1 so it feels rubber-banded
const RESISTANCE = 0.5;
// How far the gesture has to travel before we decide it's a pull rather than a scroll
const DIRECTION_LOCK_PX = 10;

export default function usePullToRefresh(scrollEl: Ref<HTMLElement | null>, onRefresh: () => Promise<void>) {
  const pullDistance = ref(0);
  const isRefreshing = ref(false);
  const isDragging = ref(false);

  const isArmed = computed(() => !isRefreshing.value && pullDistance.value >= THRESHOLD_PX);

  // Tracking means the gesture is still a candidate, pulling means we've committed to it
  let isTracking = false;
  let isPulling = false;
  let startX = 0;
  let startY = 0;

  const reset = () => {
    isTracking = false;
    isPulling = false;
    isDragging.value = false;
    pullDistance.value = 0;
  };

  const onTouchStart = (e: TouchEvent) => {
    isTracking = false;
    isPulling = false;

    if (isRefreshing.value || e.touches.length !== 1) return;

    const touch = e.touches[0]!;
    const el = scrollEl.value;

    // Only a pull that starts at the very top of the list counts
    if (!el || el.scrollTop > 0) return;

    startX = touch.clientX;
    startY = touch.clientY;
    isTracking = true;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isTracking) return;

    const touch = e.touches[0];
    if (!touch) return;

    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (!isPulling) {
      // Not enough movement yet to tell what this gesture is
      if (Math.abs(dx) < DIRECTION_LOCK_PX && Math.abs(dy) < DIRECTION_LOCK_PX) return;

      // Scrolling up or swiping sideways - leave the gesture to the browser
      if (dy < DIRECTION_LOCK_PX || Math.abs(dx) > Math.abs(dy)) {
        isTracking = false;
        return;
      }

      isPulling = true;
      isDragging.value = true;
    }

    // Stop the container scrolling underneath the pull
    e.preventDefault();

    pullDistance.value = Math.min(MAX_PULL_PX, Math.max(0, dy * RESISTANCE));
  };

  const onTouchEnd = async () => {
    if (!isPulling) {
      isTracking = false;
      return;
    }

    isTracking = false;
    isPulling = false;
    isDragging.value = false;

    if (pullDistance.value < THRESHOLD_PX) {
      pullDistance.value = 0;
      return;
    }

    // Hold the indicator open at the threshold so the spinner stays visible
    isRefreshing.value = true;
    pullDistance.value = THRESHOLD_PX;

    try {
      await onRefresh();
    } catch (err) {
      // Surfacing the failure is the caller's job. This is only here so a rejected
      // refresh doesn't become an unhandled rejection from the touch listener.
      console.error(err);
    } finally {
      isRefreshing.value = false;
      pullDistance.value = 0;
    }
  };

  const onTouchCancel = () => {
    if (isRefreshing.value) return;
    reset();
  };

  watch(
    scrollEl,
    (el, _previousEl, onCleanup) => {
      if (!el) return;

      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchmove", onTouchMove, { passive: false });
      el.addEventListener("touchend", onTouchEnd, { passive: true });
      el.addEventListener("touchcancel", onTouchCancel, { passive: true });

      onCleanup(() => {
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
        el.removeEventListener("touchcancel", onTouchCancel);
        reset();
      });
    },
    { immediate: true },
  );

  return {
    pullDistance,
    isRefreshing,
    isDragging,
    isArmed,
    thresholdPx: THRESHOLD_PX,
  };
}
