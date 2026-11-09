"use client";

import {
  useRef,
  useState,
  ReactNode,
  useEffect,
  useContext,
  useCallback,
  useEffectEvent,
  createContext,
} from "react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/shared/notifications";

import { usePathname, useRouter } from "@/i18n/navigation";
import { usePushNotificationListener } from "@/hook/use-push-notifications";

import { GuestType } from "@/types/shared";
import { Notification, NotificationsResponse } from "@/types/notifications";

type NotificationsContextValue = {
  role: GuestType;
  notifications: Notification[];
  unreadCount: number;
  /** Resolves to false when the request failed and the change was rolled back */
  markAsRead: (id: Notification["id"]) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  /** Re-fetches the latest notifications and the unread count */
  refresh: () => Promise<void>;
};

const REFRESH_DEBOUNCE_MS = 800;
const POLL_INTERVAL_MS = 60_000;

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

  const refresh = useCallback(async () => {
    const data = await getNotifications();
    if (!data) return;

    setNotifications(data.data);
    setUnreadCount(data.unread_count);
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const refreshTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounced so triggers that fire together (related pushes such as emergency
  // "accepted" then "joined", or focus + visibilitychange) make one request
  const scheduleSync = useCallback(() => {
    clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => {
      // The notifications page renders server data, so refresh the route;
      // that also resets this provider through initialData
      if (pathname.endsWith("/notifications")) router.refresh();
      else void refresh();
    }, REFRESH_DEBOUNCE_MS);
  }, [pathname, router, refresh]);

  // Real time: a push carries no notification id or created_at, so instead of
  // building one from it, re-fetch from the API
  usePushNotificationListener({ onReceive: () => scheduleSync() });

  // Polling fallback: every minute while the tab is visible, and right away
  // when the user comes back to it
  const syncFromEffect = useEffectEvent(() => scheduleSync());

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") syncFromEffect();
    }, POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") syncFromEffect();
    };

    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      clearTimeout(refreshTimer.current);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        role,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refresh,
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
