import { Avatar } from "@heroui/react";
import { AvatarWithPresence } from "../presence/AvatarWithPresence";
import { useLastSeen } from "../presence/useLastSeen";

export function ConversationRow({ user, selected, onSelect }) {
  const lastSeenLabel = useLastSeen(user.lastSeenAt, user.isOnline ?? true);

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{ paddingTop: "var(--row-padding-y)", paddingBottom: "var(--row-padding-y)" }}
      className={`pressable flex w-full items-center gap-3 border-b border-border px-3 text-left transition-colors duration-[var(--duration-fast)] ${
        selected ? "bg-accent-soft" : ""
      }`}
    >
      <AvatarWithPresence isOnline={user.isOnline ?? true}>
        <Avatar className="size-12 shrink-0">
          <Avatar.Image alt={user.name} src={user.avatarUrl} />
          <Avatar.Fallback className="text-sm font-medium">{user.initials}</Avatar.Fallback>
        </Avatar>
      </AvatarWithPresence>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold">{user.name}</p>
        <p
          className={`truncate text-xs ${
            user.isOnline ? "font-medium text-success" : "text-muted"
          }`}
        >
          {lastSeenLabel}
        </p>
      </div>
    </button>
  );
}