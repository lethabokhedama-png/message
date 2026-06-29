import { Avatar, Button } from "@heroui/react";
import { ChevronLeftIcon, MoreVerticalIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { AppLogo } from "../../ui/AppLogo";
import { AvatarWithPresence } from "../presence/AvatarWithPresence";
import { useLastSeen } from "../presence/useLastSeen";
import { useChatStore } from "../../store/useChatStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";
import { useNavigate } from "react-router";
import { useNavigate } from 'react-router-dom';

export function ChatHeader() {
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);
  const setSoundEnabled = useChatStore((state) => state.setSoundEnabled);

  const { activeConversation, isLargeScreen } = useSelectedConversation();
  const navigate = useNavigate();

  const peer = activeConversation?.peer;
  const lastSeenLabel = useLastSeen(peer?.lastSeenAt, peer?.isOnline ?? true);

  return (
    <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-border bg-background/95 px-2 py-2 backdrop-blur-md sm:px-3">
      {!isLargeScreen ? (
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="pressable shrink-0"
          aria-label="Back to people"
          onPress={() => setActiveConversationId(null)}
        >
          <ChevronLeftIcon className="size-6" strokeWidth={2.25} />
        </Button>
      ) : null}

      {activeConversation ? (
        <>
          <AvatarWithPresence isOnline={peer.isOnline ?? true}>
            <Avatar className="size-9 shrink-0">
              <Avatar.Image alt={peer.name} src={peer.avatarUrl} />
              <Avatar.Fallback className="text-sm font-medium">{peer.initials}</Avatar.Fallback>
            </Avatar>
          </AvatarWithPresence>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold leading-tight">{peer.name}</p>
            <p
              className={`truncate text-xs ${
                peer.isOnline ? "font-medium text-success" : "text-muted"
              }`}
            >
              {lastSeenLabel}
            </p>
          </div>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <AppLogo size={32} className="rounded-[var(--radius-tile)]" />
          <p className="truncate text-[15px] font-semibold text-muted">Select someone to chat</p>
        </div>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="pressable shrink-0"
          aria-pressed={isSoundEnabled}
          aria-label="Toggle message sounds"
          onPress={() => setSoundEnabled(!isSoundEnabled)}
        >
          {isSoundEnabled ? (
            <Volume2Icon className="size-5" strokeWidth={2} aria-hidden />
          ) : (
            <VolumeXIcon className="size-5" strokeWidth={2} aria-hidden />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="pressable shrink-0"
          aria-label="More options"
          onPress={() => navigate("/settings")}
        >
          <MoreVerticalIcon className="size-5" strokeWidth={2} aria-hidden />
        </Button>
      </div>
    </header>
  );
}