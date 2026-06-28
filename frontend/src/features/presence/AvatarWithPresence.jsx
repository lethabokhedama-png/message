import { PresenceDot } from "./PresenceDot";

/**
 * Wraps an Avatar with a bottom-right presence dot (online / offline).
 * Adds `pressable` so tapping an avatar (e.g. to open a profile sheet) gives
 * the same gesture feedback as the rest of the app.
 */
export function AvatarWithPresence({ isOnline, children, dotClassName = "", onPress }) {
  const Wrapper = onPress ? "button" : "div";

  return (
    <Wrapper
      type={onPress ? "button" : undefined}
      onClick={onPress}
      className={`pressable relative inline-flex shrink-0 ${onPress ? "cursor-pointer" : ""}`}
    >
      {children}
      <PresenceDot
        isOnline={isOnline}
        className={`pointer-events-none absolute bottom-0 right-0 z-10 ${dotClassName}`}
      />
      <span className="sr-only">{isOnline ? "Online" : "Offline"}</span>
    </Wrapper>
  );
}