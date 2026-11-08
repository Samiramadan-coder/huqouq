"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useNotifications } from "./notifications-provider";
import NotificationItem, { useOpenNotification } from "./notification-item";
import PaginationTemplate from "../../reusable/pagination-template";
import { Notification, NotificationsMeta } from "@/types/notifications";

type Props = {
  notifications: Notification[];
  pagination: NotificationsMeta;
};

type Group = "Today" | "Yesterday" | "ThisWeek" | "Earlier";

// Grouped in a fixed time zone so the server render and the browser agree on
// which day a notification belongs to (the platform serves the UAE)
const GROUP_TIME_ZONE = "Asia/Dubai";
const DAY_MS = 24 * 60 * 60 * 1000;

const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: GROUP_TIME_ZONE });

function daysAgo(value: string, now: Date) {
  const day = (date: Date) => Date.parse(dayKey.format(date)); // YYYY-MM-DD → UTC midnight
  return Math.round((day(now) - day(new Date(value))) / DAY_MS);
}

function groupOf(value: string, now: Date): Group {
  const days = daysAgo(value, now);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "ThisWeek";
  return "Earlier";
}

// Keeps the API order (newest first), splitting it into consecutive groups
function groupNotifications(items: Notification[]) {
  const now = new Date();
  const groups: { group: Group; items: Notification[] }[] = [];

  for (const item of items) {
    const group = groupOf(item.created_at, now);
    const last = groups.at(-1);
    if (last?.group === group) last.items.push(item);
    else groups.push({ group, items: [item] });
  }

  return groups;
}

export default function NotificationsList({
  notifications,
  pagination,
}: Props) {
  const t = useTranslations("Notifications");
  const openNotification = useOpenNotification();
  const { unreadCount, markAllAsRead } = useNotifications();

  // Optimistic read state for this page until the server data refreshes
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [allRead, setAllRead] = useState(false);
  const [prevNotifications, setPrevNotifications] = useState(notifications);
  if (notifications !== prevNotifications) {
    setPrevNotifications(notifications);
    setReadIds(new Set());
    setAllRead(false);
  }

  const items = notifications.map((n) =>
    !n.read_at && (allRead || readIds.has(n.id))
      ? { ...n, read_at: new Date().toISOString() }
      : n,
  );

  const handleOpen = (notification: Notification) => {
    if (!notification.read_at) {
      setReadIds((prev) => new Set(prev).add(notification.id));
    }
    openNotification(notification);
  };

  const handleMarkAll = async () => {
    setAllRead(true);
    const success = await markAllAsRead();
    if (!success) {
      setAllRead(false);
      toast.error(t("MarkAllError"));
    }
  };

  return (
    <div className="space-y-6">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleMarkAll}>
            {t("MarkAllAsRead")}
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="py-16 text-center text-sm text-primary/40 bg-white border border-secondary rounded-md">
          {t("Empty")}
        </p>
      ) : (
        groupNotifications(items).map(({ group, items }) => (
          <section key={group} className="space-y-3">
            <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-primary/40">
              {t(`Groups.${group}`)}
            </h2>

            <ul className="bg-white border border-secondary rounded-md divide-y divide-secondary overflow-hidden">
              {items.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => handleOpen(notification)}
                    className={cn(
                      "w-full px-4 py-4 cursor-pointer transition-colors hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-none",
                      !notification.read_at && "bg-accent/5",
                    )}
                  >
                    <NotificationItem
                      notification={notification}
                      variant="full"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      {pagination.last_page > 1 && (
        <PaginationTemplate
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
        />
      )}
    </div>
  );
}
