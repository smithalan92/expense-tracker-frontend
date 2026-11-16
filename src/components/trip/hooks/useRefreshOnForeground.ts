import { useDocumentVisibility } from "@vueuse/core";
import { watch } from "vue";

const DEFAULT_MIN_INTERVAL_MS = 15_000;

type Options = {
  // Does the actual refetch
  refresh: () => Promise<void>;
  // Extra gate checked just before refreshing, e.g. offline or another refresh already running
  canRefresh?: () => boolean;
  // Throttle so quick app switches don't spam the API
  minIntervalMs?: number;
};

/*
  Silently runs `refresh` when the app returns to the foreground (hidden -> visible),
  so changes made by other people show up without a manual pull-to-refresh.
  Failures are logged only, since the user didn't trigger the refresh.
*/
export default function useRefreshOnForeground({
  refresh,
  canRefresh = () => true,
  minIntervalMs = DEFAULT_MIN_INTERVAL_MS,
}: Options) {
  const visibility = useDocumentVisibility();
  let lastRefreshAt = Date.now();
  let isRefreshing = false;

  watch(visibility, async (current, previous) => {
    if (current !== "visible" || previous !== "hidden") return;
    if (isRefreshing || !canRefresh()) return;
    if (Date.now() - lastRefreshAt < minIntervalMs) return;

    isRefreshing = true;
    try {
      await refresh();
      lastRefreshAt = Date.now();
    } catch (err) {
      console.error(err);
    } finally {
      isRefreshing = false;
    }
  });
}
