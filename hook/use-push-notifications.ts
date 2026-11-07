"use client";

import {
  hasOptedOut,
  syncPushToken,
  getPushPermission,
  enablePushNotifications,
  disablePushNotifications,
  subscribeToForegroundMessages,
  type PushPermission,
} from "@/features/push-notifications";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/user-provider";
import { useCallback, useEffect, useState } from "react";

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
// token up to date and shows foreground messages as toasts.
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
}
