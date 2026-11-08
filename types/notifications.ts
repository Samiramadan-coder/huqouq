import { Meta } from "./shared";

// Shared by client and lawyer: both use the same /api/notifications endpoint
export type NotificationTarget = {
  screen: string;
  id: number;
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  target: NotificationTarget | null;
  read_at: string | null;
  created_at: string;
};

export type NotificationsMeta = Pick<
  Meta,
  "current_page" | "last_page" | "per_page" | "total"
>;

export type NotificationsResponse = {
  data: Notification[];
  unread_count: number;
  meta: NotificationsMeta;
};
