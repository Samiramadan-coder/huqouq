// The `data` the backend sends with each push notification, by `type`.
// Add a member for every new type, then `switch (data.type)` narrows to it.
// FCM delivers all data values as strings (e.g. id: "20", not 20).

export type EmergencyAlertPushData = {
  type: "emergency_alert" | "emergency_lawyer_accepted";
  id: string;
  screen: string;
};

export type PushNotificationData = EmergencyAlertPushData;

export type PushNotificationType = PushNotificationData["type"];
