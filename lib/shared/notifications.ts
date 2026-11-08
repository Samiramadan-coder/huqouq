"use server";

import { http } from "../http";
import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { Notification, NotificationsResponse } from "@/types/notifications";

type MarkReadResponse = { success: boolean; message?: string };

// Notifications list with the unread count, shared by client and lawyer
export async function getNotifications(
  page = 1,
): Promise<NotificationsResponse | null> {
  try {
    const { data } = await http.get<NotificationsResponse>(
      "/api/notifications",
      { params: { page }, next: { tags: ["notifications"] } },
    );

    return data;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error fetching notifications:", error);
    return null;
  }
}

// Mark a single notification as read
export async function markNotificationAsRead(
  id: Notification["id"],
): Promise<MarkReadResponse> {
  try {
    const { data } = await http.post<{ message?: string }>(
      `/api/notifications/${id}/read`,
    );

    updateTag("notifications");
    return { success: true, message: data?.message };
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error marking notification as read:", error);
    return { success: false };
  }
}

// Mark every notification as read
export async function markAllNotificationsAsRead(): Promise<MarkReadResponse> {
  try {
    const { data } = await http.post<{ message?: string }>(
      "/api/notifications/read-all",
    );

    updateTag("notifications");
    return { success: true, message: data?.message };
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error marking all notifications as read:", error);
    return { success: false };
  }
}
