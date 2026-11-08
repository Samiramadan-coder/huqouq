"use client";

import {
  useState,
  ReactNode,
  useContext,
  useCallback,
  createContext,
} from "react";

import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/shared/notifications";

import { GuestType } from "@/types/shared";
import { Notification, NotificationsResponse } from "@/types/notifications";

type NotificationsContextValue = {
  role: GuestType;
  notifications: Notification[];
  unreadCount: number;
  /** Resolves to false when the request failed and the change was rolled back */
  markAsRead: (id: Notification["id"]) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  /** Prepends a notification received in real time */
  addNotification: (notification: Notification) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

type Props = {
  role: GuestType;
  initialData: NotificationsResponse | null;
  children: ReactNode;
};

export function NotificationsProvider({ role, initialData, children }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(
    initialData?.data ?? [],
  );
  const [unreadCount, setUnreadCount] = useState(
    initialData?.unread_count ?? 0,
  );

  // The server stays the source of truth: when the layout re-renders with fresh
  // data (router.refresh / updateTag), reset the local state to it
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setNotifications(initialData?.data ?? []);
    setUnreadCount(initialData?.unread_count ?? 0);
  }

  const setReadAt = useCallback(
    (id: Notification["id"], readAt: string | null) =>
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: readAt } : n)),
      ),
    [],
  );

  const markAsRead = useCallback(
    async (id: Notification["id"]) => {
      const target = notifications.find((n) => n.id === id);
      if (target?.read_at) return true;

      // Optimistic update; the item may not be in the list (e.g. older page)
      if (target) setReadAt(id, new Date().toISOString());
      setUnreadCount((count) => Math.max(0, count - 1));

      const { success } = await markNotificationAsRead(id);
      if (!success) {
        if (target) setReadAt(id, null);
        setUnreadCount((count) => count + 1);
      }
      return success;
    },
    [notifications, setReadAt],
  );

  const markAllAsRead = useCallback(async () => {
    const previousNotifications = notifications;
    const previousCount = unreadCount;
    if (previousCount === 0) return true;

    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) => (n.read_at ? n : { ...n, read_at: now })),
    );
    setUnreadCount(0);

    const { success } = await markAllNotificationsAsRead();
    if (!success) {
      setNotifications(previousNotifications);
      setUnreadCount(previousCount);
    }
    return success;
  }, [notifications, unreadCount]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) =>
      prev.some((n) => n.id === notification.id)
        ? prev
        : [notification, ...prev],
    );
    if (!notification.read_at) setUnreadCount((count) => count + 1);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        role,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }
  return context;
}
