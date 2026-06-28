/**
 * A small Instagram-style presence dot. Green + soft pulse when online,
 * neutral grey when offline. Used standalone (e.g. list rows without an
 * avatar wrapper) or composed inside AvatarWithPresence.
 */
export function PresenceDot({ isOnline, size = "size-[11px]", className = "" }) {
  return (
    <span
      className={[
        size,
        "rounded-full border-[2.5px] border-white shadow-sm dark:border-zinc-950",
        "transition-colors duration-[var(--duration-base)]",
        isOnline ? "bg-emerald-500 animate-pulse-dot" : "bg-[#C7C7CC] dark:bg-[#636366]",
        className,
      ].join(" ")}
      aria-hidden
    />
  );
}