// Firebase Cloud Messaging service worker: shows push notifications while
// no tab of the app is visible.
//
// Service workers can't read process.env, so the page passes the public
// Firebase config (and the SDK version, to match the installed `firebase`
// package) as query params when it registers this file. See
// features/push-notifications.ts.

// Registered BEFORE importing Firebase on purpose: Firebase's own click
// handler stops other listeners for notifications it displayed, so ours has
// to run first to handle `data.url`.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.stopImmediatePropagation();

  event.waitUntil(openNotificationUrl(getNotificationUrl(event.notification)));
});

// `notification` messages are displayed by Firebase and keep the FCM payload
// under FCM_MSG; data-only messages are displayed below with `{ url }`.
function getNotificationUrl(notification) {
  const data = notification.data || {};
  const payload = data.FCM_MSG || {};

  return (
    data.url ||
    (payload.data && payload.data.url) ||
    (payload.fcmOptions && payload.fcmOptions.link) ||
    "/"
  );
}

async function openNotificationUrl(rawUrl) {
  const url = new URL(rawUrl, self.location.origin);
  const sameOrigin = url.origin === self.location.origin;

  const windows = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  // Prefer a tab already on that page, then any tab of the app
  const existing =
    windows.find((client) => client.url === url.href) ||
    (sameOrigin && windows[0]);

  if (!existing) {
    return self.clients.openWindow(url.href);
  }

  const focused = await existing.focus();

  if (focused.url !== url.href && "navigate" in focused) {
    return focused.navigate(url.href);
  }

  return focused;
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
    // Firebase already displays messages that have a `notification` block
    if (payload.notification) return;

    const data = payload.data || {};

    if (!data.title) return;

    return self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      data: { url: data.url },
    });
  });
} else {
  console.error(
    "[firebase-messaging-sw] Missing Firebase config query params; push notifications are disabled.",
  );
}
