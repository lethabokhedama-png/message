export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Formats a presence timestamp the way Instagram/iMessage do:
 * "Active now" while online, then a short relative span (5s/12m/3h/2d ago),
 * rolling over to "Long time ago" once it's been more than 24h.
 *
 * @param {string | number | Date | null | undefined} lastSeenAt
 * @param {boolean} isOnline
 */
export function formatLastSeen(lastSeenAt, isOnline) {
  if (isOnline) return "Active now";
  if (!lastSeenAt) return "Offline";

  const lastSeenMs = new Date(lastSeenAt).getTime();
  if (Number.isNaN(lastSeenMs)) return "Offline";

  const diffMs = Date.now() - lastSeenMs;
  if (diffMs < 0) return "Active now";

  if (diffMs >= DAY) return "Long time ago";

  if (diffMs < MINUTE) {
    const seconds = Math.max(1, Math.floor(diffMs / SECOND));
    return `Active ${seconds}s ago`;
  }

  if (diffMs < HOUR) {
    const minutes = Math.floor(diffMs / MINUTE);
    return `Active ${minutes}m ago`;
  }

  const hours = Math.floor(diffMs / HOUR);
  return `Active ${hours}h ago`;
}