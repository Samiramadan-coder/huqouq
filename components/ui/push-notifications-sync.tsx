"use client";

import { usePushNotificationsSync } from "@/hook/use-push-notifications";

// Re-registers this browser's push token for the logged-in user when it
// changes, and shows notifications received while the app is open as toasts.
export function PushNotificationsSync() {
  usePushNotificationsSync();

  return null;
}
