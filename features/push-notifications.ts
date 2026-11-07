import {
  getToken,
  onMessage,
  deleteToken,
  isSupported,
  getMessaging,
  type Messaging,
  type MessagePayload,
} from "firebase/messaging";

import { SDK_VERSION } from "firebase/app";

import app from "@/lib/firebase";
import { registerDevice, unregisterDevice } from "@/lib/devices";

const SW_PATH = "/firebase-messaging-sw.js";
// Firebase's default push scope; keeps this worker from controlling pages
const SW_SCOPE = "/firebase-cloud-messaging-push-scope";

// Last token sent to the API, and for which user
const TOKEN_STORAGE_KEY = "push:registered-token";
// Set when the user turns notifications off, so app loads don't re-register
const OPT_OUT_STORAGE_KEY = "push:opted-out";

export type PushPermission = NotificationPermission | "unsupported";

type StoredToken = { userId: string; token: string };

let messagingPromise: Promise<Messaging | null> | null = null;
let registrationPromise: Promise<ServiceWorkerRegistration> | null = null;

// Messaging needs browser APIs (service workers, Push API) that aren't
// available during SSR or in some browsers, e.g. iOS Safari outside a PWA.
export function getMessagingIfSupported(): Promise<Messaging | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  messagingPromise ??= isSupported()
    .then((supported) => (supported ? getMessaging(app) : null))
    .catch(() => null);

  return messagingPromise;
}

export async function getPushPermission(): Promise<PushPermission> {
  const messaging = await getMessagingIfSupported();

  return messaging ? Notification.permission : "unsupported";
}

// The service worker can't read env vars, so pass it the config of the app
// instance from lib/firebase.ts. A config or SDK change gives a new script
// URL, which makes the browser update the worker.
function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!registrationPromise) {
    const {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    } = app.options;

    const params = new URLSearchParams({ sdk: SDK_VERSION });

    Object.entries({
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    }).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    registrationPromise = navigator.serviceWorker
      .register(`${SW_PATH}?${params}`, { scope: SW_SCOPE })
      .catch((error) => {
        registrationPromise = null;
        throw error;
      });
  }

  return registrationPromise;
}

function getVapidKey(): string {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  if (!vapidKey) {
    throw new Error("NEXT_PUBLIC_FIREBASE_VAPID_KEY is not set");
  }

  return vapidKey;
}

// Always passes our registration so Firebase never registers its default
// worker (which would have no config)
async function getFcmToken(messaging: Messaging): Promise<string> {
  return getToken(messaging, {
    vapidKey: getVapidKey(),
    serviceWorkerRegistration: await registerServiceWorker(),
  });
}

function readStoredToken(): StoredToken | null {
  try {
    const value = localStorage.getItem(TOKEN_STORAGE_KEY);
    return value ? (JSON.parse(value) as StoredToken) : null;
  } catch {
    return null;
  }
}

function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function hasOptedOut(): boolean {
  return localStorage.getItem(OPT_OUT_STORAGE_KEY) === "1";
}

export function isRegisteredFor(userId: string | number): boolean {
  return readStoredToken()?.userId === String(userId);
}

// Get the current FCM token and send it to the API if it changed (or was
// sent for another user). Does nothing unless permission is already granted.
export async function syncPushToken(userId: string | number): Promise<boolean> {
  const messaging = await getMessagingIfSupported();

  if (!messaging || Notification.permission !== "granted" || hasOptedOut()) {
    return false;
  }

  const token = await getFcmToken(messaging);
  const stored = readStoredToken();

  if (stored?.token === token && stored.userId === String(userId)) {
    return true;
  }

  const result = await registerDevice(token);

  if (!result.success) {
    throw new Error("Failed to register device for push notifications");
  }

  localStorage.setItem(
    TOKEN_STORAGE_KEY,
    JSON.stringify({ userId: String(userId), token } satisfies StoredToken),
  );

  return true;
}

// Must be called from a user action (click/toggle): browsers ignore or
// penalize permission prompts that aren't triggered by the user.
export async function enablePushNotifications(
  userId: string | number,
): Promise<PushPermission> {
  const messaging = await getMessagingIfSupported();

  if (!messaging) {
    return "unsupported";
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    localStorage.removeItem(OPT_OUT_STORAGE_KEY);
    await syncPushToken(userId);
  }

  return permission;
}

// Remove this browser's token from the API and delete it in FCM so it stops
// receiving pushes. Used on logout and when the user turns notifications
// off; never throws.
//
// Call it BEFORE logging out: the API call needs the auth cookie. Pass
// `notifyApi: false` when the session is already gone (e.g. account deleted).
export async function unregisterPushNotifications({
  notifyApi = true,
}: { notifyApi?: boolean } = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const stored = readStoredToken();
  clearStoredToken();

  if (!stored) {
    return;
  }

  try {
    if (notifyApi) {
      await unregisterDevice(stored.token);
    }

    const messaging = await getMessagingIfSupported();

    if (!messaging || Notification.permission !== "granted") {
      return;
    }

    // deleteToken needs our worker registration, which getToken sets
    await getFcmToken(messaging);
    await deleteToken(messaging);
  } catch (error) {
    console.error("Error deleting push notification token:", error);
  }
}

export async function disablePushNotifications() {
  localStorage.setItem(OPT_OUT_STORAGE_KEY, "1");
  await unregisterPushNotifications();
}

// Messages received while a tab of the app is visible
export async function subscribeToForegroundMessages(
  onPayload: (payload: MessagePayload) => void,
): Promise<() => void> {
  const messaging = await getMessagingIfSupported();

  return messaging ? onMessage(messaging, onPayload) : () => {};
}
