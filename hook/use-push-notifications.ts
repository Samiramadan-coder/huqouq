"use client";

import {
  hasOptedOut,
  syncPushToken,
  getPushPermission,
  type PushPermission,
  enablePushNotifications,
  disablePushNotifications,
  subscribeToForegroundMessages,
  subscribeToNotificationClicks,
  subscribeToBackgroundMessages,
  onPushEvent,
  emitPushEvent,
  toPushNotification,
  type PushEvent,
  type PushNotification,
} from "@/features/push-notifications";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/user-provider";
import { useCallback, useEffect, useEffectEvent, useState } from "react";

export type PushStatus =
  | "loading"
  | "unsupported"
  | "denied"
  | "enabled"
  | "disabled";

function toStatus(permission: PushPermission): PushStatus {
  if (permission === "unsupported" || permission === "denied") {
    return permission;
  }

  return permission === "granted" && !hasOptedOut() ? "enabled" : "disabled";
}

// State and actions for a "push notifications" toggle
export function usePushNotifications() {
  const { user } = useUser();
  const userId = user?.id;
  const [status, setStatus] = useState<PushStatus>("loading");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getPushPermission().then((permission) => {
      if (!cancelled) setStatus(toStatus(permission));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const enable = useCallback(async () => {
    if (userId == null) return;

    setPending(true);

    try {
      const permission = await enablePushNotifications(userId);
      const next = toStatus(permission);
      setStatus(next);
      return next;
    } finally {
      setPending(false);
    }
  }, [userId]);

  const disable = useCallback(async () => {
    setPending(true);

    try {
      await disablePushNotifications();
      setStatus("disabled");
    } finally {
      setPending(false);
    }
  }, []);

  return { status, pending, enable, disable };
}

// Mounted once for the whole app: keeps the API's copy of this browser's FCM
// token up to date, shows foreground messages as toasts, and passes every
// received/clicked notification to usePushNotificationListener.
export function usePushNotificationsSync() {
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();
  const t = useTranslations("Common.PushNotifications");

  useEffect(() => {
    if (userId == null) return;

    syncPushToken(userId).catch((error) =>
      console.error("Error syncing push notification token:", error),
    );
  }, [userId]);

  useEffect(() => {
    if (userId == null) return;

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    subscribeToForegroundMessages((payload) => {
      emitPushEvent({
        kind: "received",
        notification: toPushNotification(payload),
        foreground: true,
      });

      const title = payload.notification?.title ?? payload.data?.title;

      if (!title) return;

      const url = payload.data?.url ?? payload.fcmOptions?.link;

      toast(title, {
        description: payload.notification?.body ?? payload.data?.body,
        action: url
          ? { label: t("view"), onClick: () => router.push(url) }
          : undefined,
      });
    }).then((unsub) => {
      if (cancelled) unsub();
      else unsubscribe = unsub;
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [userId, router, t]);

  useEffect(
    () =>
      subscribeToBackgroundMessages((payload) => {
        emitPushEvent({
          kind: "received",
          notification: toPushNotification(payload),
          foreground: false,
        });
      }),
    [],
  );

  // Clicks on system notifications (shown while the app was in the background)
  useEffect(
    () =>
      subscribeToNotificationClicks((notification) => {
        emitPushEvent({ kind: "clicked", notification });
      }),
    [],
  );
}

type PushNotificationHandlers = {
  // `foreground`: the app was visible when it arrived (shown as a toast);
  // otherwise it was shown as a system notification
  onReceive?: (notification: PushNotification, foreground: boolean) => void;
  onClick?: (notification: PushNotification) => void;
};

// Use in any client component to react to push notifications, e.g.
//   usePushNotificationListener({
//     onReceive: (n) => n.data.type === "emergency_alert" && refresh(),
//   });
export function usePushNotificationListener({
  onReceive,
  onClick,
}: PushNotificationHandlers) {
  // Always calls the latest handlers without resubscribing on every render
  const handleEvent = useEffectEvent((event: PushEvent) => {
    if (event.kind === "received") {
      onReceive?.(event.notification, event.foreground);
    } else {
      onClick?.(event.notification);
    }
  });

  useEffect(() => onPushEvent((event) => handleEvent(event)), []);
}
