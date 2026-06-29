import { useWallpaper } from "../context/WallpaperContext";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSelectedConversation } from "../hooks/useSelectedConversation";
import React, { useEffect, useRef } from 'react';
import ChatSidebar from "../features/chat/ChatSidebar";
import { ChatHeader } from "../features/chat/ChatHeader";
import { MessageList } from "../features/chat/MessageList";
import { ChatComposer } from "../features/chat/ChatComposer";

function ChatPage() {
  const { frameStyle } = useWallpaper();

  const getConversations = useChatStore((state) => state.getConversations);
  const getMessages = useChatStore((state) => state.getMessages);
  const getUsers = useChatStore((state) => state.getUsers);
  const getGroups = useChatStore((state) => state.getGroups);
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages);

  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const previousOnlineUsersRef = useRef(onlineUsers);

  const { activeConversation, activeConversationId, isLargeScreen } = useSelectedConversation();

  useEffect(() => {
    getUsers();
    getConversations();
    getGroups();
  }, [getConversations, getUsers, getGroups]);

  useEffect(() => {
    if (!activeConversationId) return;

    getMessages(activeConversationId);
    subscribeToMessages(activeConversationId);

    // cleanup
    return () => unsubscribeFromMessages();
  }, [getMessages, activeConversationId, subscribeToMessages, unsubscribeFromMessages]);

  // The backend stamps `lastSeen` on the user document at the moment of socket
  // disconnect. Our in-memory `users`/`conversations` lists won't pick that up
  // on their own, so whenever someone drops out of `onlineUsers` we refetch —
  // that pulls the fresh `lastSeen` value into the UI without a manual reload.
  useEffect(() => {
    const previousOnlineUsers = previousOnlineUsersRef.current;
    const wentOffline = previousOnlineUsers.some((id) => !onlineUsers.includes(id));

    if (wentOffline) {
      getUsers();
      getConversations();
    }

    previousOnlineUsersRef.current = onlineUsers;
  }, [onlineUsers, getUsers, getConversations]);

  return (
    <div className="h-dvh overflow-hidden bg-background lg:flex lg:p-6" style={frameStyle}>
      <div className="flex h-full w-full flex-col overflow-hidden bg-background text-foreground lg:mx-auto lg:max-w-6xl lg:flex-row lg:rounded-[var(--radius-sheet)] lg:border lg:border-border lg:shadow-2xl lg:shadow-black/10">
        <ChatSidebar />

        <div
          className={`flex-1 flex-col overflow-hidden ${
            !isLargeScreen && !activeConversationId ? "hidden lg:flex" : "flex"
          }`}
        >
          <ChatHeader />
          <MessageList />

          {activeConversation ? <ChatComposer /> : null}
        </div>
      </div>
    </div>
  );
}
export default ChatPage;
