/*
  Random ID for this app instance (tab / PWA launch), sent as X-Client-Id on every API request.
  The backend uses it to skip sending an events stream message back to the client that made
  the change, while the same user's other tabs and devices still get it. Must be per instance,
  not per user or device, or tabs of the same user would suppress each other's events.
*/
function generateClientId() {
  // randomUUID only exists in secure contexts, which a dev server on a LAN IP isn't
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const CLIENT_ID = generateClientId();

export const CLIENT_ID_HEADER = "X-Client-Id";
