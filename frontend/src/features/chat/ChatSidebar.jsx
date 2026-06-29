import { getInitials, useSelectedConversation } from "../../hooks/useSelectedConversation";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { APP_NAME, AppLogo } from "../../ui/AppLogo";
import { UserButton } from "@clerk/react";
import { SearchField } from "@heroui/react";
import { UsersIcon } from "lucide-react";
import { ConversationRow } from "./ConversationRow";
import { BottomNav } from "./BottomNav";
import { useNavigate } from 'react-router-dom';

function toListItem(user, onlineUsers, hasHistory) {
  const isOnline = onlineUsers.includes(user._id);
  return {
    id: user._id,
    conversationId: user._id,
    name: user.fullName,
    avatarUrl: user.profilePic,
    initials: getInitials(user.fullName),
    isOnline,
    lastSeenAt: user.lastSeen ?? null,
    hasHistory,
  };
}

/**
 * Builds one merged, deduped people list: everyone in the DB (`users`),
 * with anyone who also appears in `conversations` (i.e. has message history)
 * flagged and floated to the top. This is the single source of truth for
 * "who can I talk to" — there's no separate users/chats sub-tab anymore.
 */
function buildPeopleList(users, conversations, onlineUsers) {
  const conversationIds = new Set(conversations.map((u) => u._id));

  const items = users.map((user) => toListItem(user, onlineUsers, conversationIds.has(user._id)));

  return items.sort((a, b) => {
    if (a.hasHistory !== b.hasHistory) return a.hasHistory ? -1 : 1;
    if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function ChatSidebar() {
  const conversations = useChatStore((state) => state.conversations);
  const users = useChatStore((state) => state.users);
  const groups = useChatStore((state) => state.groups);
  const isUsersLoading = useChatStore((state) => state.isUsersLoading);

  const searchQuery = useChatStore((state) => state.searchQuery);
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);

  const sidebarTab = useChatStore((state) => state.sidebarTab);
  const setSidebarTab = useChatStore((state) => state.setSidebarTab);

  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);

  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  const { activeConversationId, isLargeScreen } = useSelectedConversation();
  const navigate = useNavigate();

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const people = buildPeopleList(users, conversations, onlineUsers);

  const filteredPeople = normalizedSearchQuery
    ? people.filter((person) => person.name.toLowerCase().includes(normalizedSearchQuery))
    : people;

  const handleBottomNavChange = (tab) => {
    if (tab === "settings") {
      navigate("/settings");
      return;
    }
    setSidebarTab(tab);
  };

  return (
    <aside
      className={`flex w-full shrink-0 flex-col overflow-hidden bg-background lg:w-80 lg:border-r lg:border-border ${
        !isLargeScreen && activeConversationId ? "hidden lg:flex" : "flex"
      }`}
    >
      <div className="shrink-0 border-b border-border px-3 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] sm:pt-3">
        <div className="flex items-center gap-2.5">
          <AppLogo size={32} className="size-8 shrink-0 rounded-[var(--radius-tile)]" alt="" />
          <p className="flex-1 truncate text-[19px] font-bold tracking-tight sm:text-[22px]">
            {sidebarTab === "groups" ? "Groups" : APP_NAME}
          </p>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8",
              },
            }}
          />
        </div>
      </div>

      <div className="shrink-0 border-b border-border px-3 pb-2.5 pt-2.5">
        <SearchField
          fullWidth
          variant="secondary"
          className="w-full"
          value={searchQuery}
          onChange={setSearchQuery}
        >
          <SearchField.Group className="rounded-[var(--radius-pill)]">
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search people" />
            {searchQuery ? <SearchField.ClearButton className="pressable" /> : null}
          </SearchField.Group>
        </SearchField>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto outline-none">
        {sidebarTab === "groups" ? (
          groups.length === 0 ? (
            <div className="animate-fade-in-up flex flex-col items-center gap-3 px-4 py-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-[var(--radius-card)] bg-accent-soft">
                <UsersIcon className="size-7 text-accent" strokeWidth={1.5} aria-hidden />
              </div>
              <div className="space-y-1">
                <p className="text-[15px] font-semibold">No groups yet</p>
                <p className="max-w-56 text-[13px] leading-relaxed text-muted">
                  Group chats will show up here once you create or join one.
                </p>
              </div>
            </div>
          ) : (
            groups.map((group) => (
              <ConversationRow
                key={group.id}
                user={group}
                selected={group.id === activeConversationId}
                onSelect={() => setActiveConversationId(group.id)}
              />
            ))
          )
        ) : isUsersLoading && filteredPeople.length === 0 ? (
          <div className="flex flex-col gap-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <div className="size-12 shrink-0 animate-pulse rounded-full bg-surface" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-2/5 animate-pulse rounded-full bg-surface" />
                  <div className="h-3 w-1/4 animate-pulse rounded-full bg-surface" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPeople.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted">
            {normalizedSearchQuery ? "No one matches your search." : "No one else here yet."}
          </p>
        ) : (
          filteredPeople.map((person) => (
            <ConversationRow
              key={person.id}
              user={person}
              selected={person.id === activeConversationId}
              onSelect={() => setActiveConversationId(person.id)}
            />
          ))
        )}
      </div>

      <BottomNav activeTab={sidebarTab} onTabChange={handleBottomNavChange} />
    </aside>
  );
}
export default ChatSidebar;