// Firebase Cloud Messaging service worker: shows push notifications while
// no tab of the app is visible.
//
// Service workers can't read process.env, so the page passes the public
// Firebase config (and the SDK version, to match the installed `firebase`
// package) as query params when it registers this file. See
// features/push-notifications.ts.

// Messages exchanged with the page (see features/push-notifications.ts)
const CLICK_MESSAGE = "push-notification-click";
const CLICK_READY_MESSAGE = "push-notification-click-ready";
const RECEIVED_MESSAGE = "push-notification-received";

// Hash added to a tab opened by a click: `#push-click=<id>`. Only that page
// asks for the click, by id, so other page loads never get an old one.
const CLICK_HASH_PREFIX = "#push-click=";
const PENDING_CLICK_TTL_MS = 30_000;

// The clicked notification waiting for the tab it opened to load
let pendingClick = null;

// Registered BEFORE importing Firebase on purpose: Firebase's own click
// handler stops other listeners for notifications it displayed, so ours has
// to run first.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.stopImmediatePropagation();

  const content = getNotificationContent(event.notification);

  event.waitUntil(openNotification(content));
});

// A page finished loading: hand it the click that opened it, if any
self.addEventListener("message", (event) => {
  if (event.data?.type !== CLICK_READY_MESSAGE) return;
  if (!pendingClick || event.data.id !== pendingClick.id) return;

  const { notification, expiresAt } = pendingClick;
  pendingClick = null;

  if (Date.now() > expiresAt) return;

  event.source?.postMessage({ type: CLICK_MESSAGE, notification });
});

// `notification` messages are displayed by Firebase and keep the FCM payload
// under FCM_MSG; data-only messages are displayed below with `{ payload }`.
function getNotificationContent(notification) {
  const data = notification.data || {};
  const fcm = data.FCM_MSG;

  return {
    title: notification.title,
    body: notification.body,
    data: (fcm ? fcm.data : data.payload) || {},
    link: fcm?.fcmOptions?.link,
  };
}

// Hand the click to the app: focus an open tab, or open one if none is.
// What to do per notification type is decided by the page.
async function openNotification(content) {
  const windows = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  const existing = windows.find((client) =>
    client.url.startsWith(self.location.origin),
  );

  if (existing) {
    // Delivered directly; drop any older click still waiting
    pendingClick = null;

    const focused = await existing.focus();
    return focused.postMessage({ type: CLICK_MESSAGE, notification: content });
  }

  const id = String(Date.now()) + Math.random().toString(36).slice(2);

  pendingClick = {
    id,
    notification: content,
    expiresAt: Date.now() + PENDING_CLICK_TTL_MS,
  };

  return self.clients.openWindow(`/${CLICK_HASH_PREFIX}${id}`);
}

const params = new URL(self.location.href).searchParams;
const sdkVersion = params.get("sdk");

const firebaseConfig = {
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
};

if (
  sdkVersion &&
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
) {
  importScripts(
    `https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-app-compat.js`,
    `https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-messaging-compat.js`,
  );

  firebase.initializeApp(firebaseConfig);

  firebase.messaging().onBackgroundMessage((payload) => {
    return Promise.all([
      forwardToOpenTabs(payload),
      showDataNotification(payload),
    ]);
  });

  // No tab is visible, so the page's onMessage doesn't fire; let open (hidden)
  // tabs know a message arrived
  async function forwardToOpenTabs(payload) {
    const windows = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    windows.forEach((client) =>
      client.postMessage({ type: RECEIVED_MESSAGE, payload }),
    );
  }

  function showDataNotification(payload) {
    // Firebase already displays messages that have a `notification` block
    if (payload.notification) return;

    const data = payload.data || {};

    if (!data.title) return;

    return self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      data: { payload: data },
    });
  }
} else {
  console.error(
    "[firebase-messaging-sw] Missing Firebase config query params; push notifications are disabled.",
  );
}
