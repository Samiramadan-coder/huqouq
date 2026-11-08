"use client";

import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { useFormatters } from "@/lib/format";
import { useRouter } from "@/i18n/navigation";
import { Notification } from "@/types/notifications";
import { useNotifications } from "./notifications-provider";
import { getNotificationConfig } from "./notification-config";

type Props = {
  notification: Notification;
  variant?: "compact" | "full";
};

// Presentational only; the wrapper (dropdown item / page row) handles the click
// through useOpenNotification
export default function NotificationItem({
  notification,
  variant = "full",
}: Props) {
  const { role } = useNotifications();
  const { relativeTime } = useFormatters();
  const { icon: Icon, tone } = getNotificationConfig(notification, role);
  const unread = !notification.read_at;

  return (
    <div className="flex items-start gap-4 w-full text-start">
      <div
        className={cn(
          "size-9 shrink-0 rounded-full flex items-center justify-center",
          tone === "accent"
            ? "bg-accent/15 text-accent"
            : "bg-secondary text-primary",
        )}
      >
        <Icon className="size-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm",
            unread
              ? "font-semibold text-primary"
              : "font-normal text-primary/80",
          )}
        >
          {notification.title}
        </p>
        <p
          className={cn(
            "mt-1 text-xs text-primary/50",
            variant === "compact" && "line-clamp-2",
          )}
        >
          {notification.body}
        </p>
        {/* Server and client clocks differ slightly on the page's first render */}
        <span
          className="block mt-1.5 text-[11px] text-primary/40"
          suppressHydrationWarning
        >
          {relativeTime(notification.created_at)}
        </span>
      </div>

      {unread && (
        <span className="self-center size-2 shrink-0 rounded-full bg-accent" />
      )}
    </div>
  );
}

// Marks the notification as read and opens its target, without waiting for the API
export function useOpenNotification() {
  const router = useRouter();
  const { role, markAsRead } = useNotifications();

  return useCallback(
    (notification: Notification) => {
      if (!notification.read_at) void markAsRead(notification.id);

      const { href } = getNotificationConfig(notification, role);
      if (href) router.push(href);
    },
    [role, markAsRead, router],
  );
}
