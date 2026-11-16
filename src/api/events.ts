import { EventStreamContentType, fetchEventSource } from "@microsoft/fetch-event-source";
import { API_URL } from "./axios";
import { CLIENT_ID, CLIENT_ID_HEADER } from "./clientId";
import type { TripExpense } from "./expense";

// Mirrors ExpenseEventMap in the backend's src/lib/EventHub.ts.
// SSE `event:` field -> JSON payload in the `data:` field.
interface ExpenseEventMap {
  "expense.added": { tripId: number; expenses: TripExpense[] };
  "expense.updated": { tripId: number; expense: TripExpense };
  "expense.deleted": { tripId: number; expenseId: number };
}

export type TripEvent = {
  [K in keyof ExpenseEventMap]: { event: K; data: ExpenseEventMap[K] };
}[keyof ExpenseEventMap];

const KNOWN_EVENTS = new Set<string>([
  "expense.added",
  "expense.updated",
  "expense.deleted",
] satisfies (keyof ExpenseEventMap)[]);

const MIN_RETRY_MS = 1_000;
const MAX_RETRY_MS = 30_000;

// Thrown to stop fetch-event-source from reconnecting
class FatalStreamError extends Error {}
// Thrown to make fetch-event-source reconnect (it doesn't retry a cleanly closed stream otherwise)
class RetriableStreamError extends Error {}

type Options = {
  authToken: string;
  onEvent: (event: TripEvent) => void;
  // Token is invalid or expired
  onUnauthorized: () => void;
};

/*
  Opens the single app-wide SSE stream (GET /v2/events) covering every trip the user is a member of.
  Events for changes the current user made aren't sent, since they already have the response.
  Native EventSource can't send the Authorization header, hence fetch-event-source.
  Reconnects with backoff until closed or a 401. Returns a function that closes the stream.
*/
export function subscribeToTripEvents({ authToken, onEvent, onUnauthorized }: Options) {
  const controller = new AbortController();
  let retryMs = MIN_RETRY_MS;

  fetchEventSource(`${API_URL}/v2/events`, {
    signal: controller.signal,
    // When the stream should be open is the caller's call. The library's own hidden handling
    // also doesn't cancel a pending retry, which can open a stream while hidden or orphan one.
    openWhenHidden: true,
    headers: { Authorization: authToken, [CLIENT_ID_HEADER]: CLIENT_ID },
    async onopen(response) {
      if (response.status === 401) {
        onUnauthorized();
        throw new FatalStreamError("Unauthorized");
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !contentType.startsWith(EventStreamContentType)) {
        throw new RetriableStreamError(`Unexpected events response: ${response.status}`);
      }

      retryMs = MIN_RETRY_MS;
    },
    onmessage(message) {
      if (!KNOWN_EVENTS.has(message.event) || !message.data) return;

      try {
        onEvent({ event: message.event, data: JSON.parse(message.data) } as TripEvent);
      } catch (err) {
        console.error(err);
      }
    },
    onclose() {
      // Server closed the stream (e.g. a deploy), reconnect
      throw new RetriableStreamError("Events stream closed");
    },
    onerror(err) {
      if (err instanceof FatalStreamError) throw err;

      const delay = retryMs;
      retryMs = Math.min(retryMs * 2, MAX_RETRY_MS);
      return delay;
    },
  }).catch((err) => {
    if (!(err instanceof FatalStreamError)) console.error(err);
  });

  // Aborting runs fetch-event-source's full cleanup, including any pending retry timer
  return () => controller.abort();
}
