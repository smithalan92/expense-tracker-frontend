import { subscribeToTripEvents } from "@/api/events";
import useAppStore from "@/store/appStore";
import useTripDataStore from "@/store/tripDataStore";
import { useDocumentVisibility } from "@vueuse/core";
import { onScopeDispose, watch } from "vue";

/*
  Keeps one events stream open while logged in and the app is visible, so expense changes made by
  other trip members show up live in the open trip. The stream is closed while hidden rather than
  left for the OS to kill. Purely reactive: delivery isn't replayed, so anything missed while
  disconnected is caught up by the normal trip loading / foreground refresh / pull-to-refresh.
*/
export default function useTripEventsStream() {
  const appStore = useAppStore();
  const tripDataStore = useTripDataStore();
  const visibility = useDocumentVisibility();
  let unsubscribe: (() => void) | null = null;

  function close() {
    unsubscribe?.();
    unsubscribe = null;
  }

  watch(
    [() => appStore.authToken, () => appStore.shouldUseSSEUpdates, visibility],
    ([authToken, shouldUseSSEUpdates, visibility]) => {
      close();
      if (!authToken || !shouldUseSSEUpdates || visibility !== "visible") return;

      unsubscribe = subscribeToTripEvents({
        authToken,
        onEvent(event) {
          tripDataStore.applyRemoteTripEvent(event);
        },
        onUnauthorized() {
          appStore.logout();
        },
      });
    },
    { immediate: true },
  );

  onScopeDispose(close);
}
