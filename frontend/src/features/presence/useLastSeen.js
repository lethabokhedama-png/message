import { useEffect, useState } from "react";
import { formatLastSeen } from "../../lib/utils";

/**
 * Returns a continuously-updating "Active now" / "Active 5s ago" / "Long time
 * ago" string for a peer. Ticks every second while in the seconds range, and
 * backs off to a slower interval once we're past a minute, so the UI doesn't
 * silently go stale while the conversation stays open.
 */
export function useLastSeen(lastSeenAt, isOnline) {
  const [label, setLabel] = useState(() => formatLastSeen(lastSeenAt, isOnline));

  useEffect(() => {
    setLabel(formatLastSeen(lastSeenAt, isOnline));

    if (isOnline) return;
    if (!lastSeenAt) return;

    const diffMs = Date.now() - new Date(lastSeenAt).getTime();
    // Tick fast while showing seconds, slow down once we're in minutes/hours —
    // no need to re-render every second once we're saying "Active 14m ago".
    const tickMs = diffMs < 60_000 ? 1000 : 30_000;

    const interval = setInterval(() => {
      setLabel(formatLastSeen(lastSeenAt, isOnline));
    }, tickMs);

    return () => clearInterval(interval);
  }, [lastSeenAt, isOnline]);

  return label;
}