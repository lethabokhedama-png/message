import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // userId -> ISO timestamp of when they were last seen online.
  // This is a frontend-derived fallback: it's set the moment a user drops out of
  // `onlineUsers`. Once the backend sends a real `lastSeen` field on the user
  // document, prefer that value over this map (see features/presence).
  lastSeenAt: {},

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      get().connectSocket(res.data);
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  clearAuth: () => {
    set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
    get().disconnectSocket();
  },

  connectSocket: (user) => {
    if (!user || get().socket?.connected) return;

    const socket = io(BASE_URL, { query: { userId: user._id } });

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      const previousOnline = get().onlineUsers;
      const droppedOff = previousOnline.filter((id) => !userIds.includes(id));

      if (droppedOff.length > 0) {
        const now = new Date().toISOString();
        set((state) => ({
          lastSeenAt: {
            ...state.lastSeenAt,
            ...Object.fromEntries(droppedOff.map((id) => [id, now])),
          },
        }));
      }

      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
    set({ socket: null });
  },
}));