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
  const { icon: Icon } = getNotificationConfig(notification, role);
  const unread = !notification.read_at;

  return (
    <div className="flex items-start gap-3 w-full text-start">
      <div className="size-9 shrink-0 rounded-full bg-accent/10 flex items-center justify-center">
        <Icon className="size-4 text-primary" />
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <p
          className={cn(
            "text-sm text-primary",
            unread ? "font-semibold" : "font-medium",
          )}
        >
          {notification.title}
        </p>
        <p
          className={cn(
            "text-xs text-primary/60",
            variant === "compact" && "line-clamp-2",
          )}
        >
          {notification.body}
        </p>
        <span className="text-[11px] text-primary/40">
          {relativeTime(notification.created_at)}
        </span>
      </div>

      {unread && (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
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
