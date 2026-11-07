"use server";

import { http } from "./http";
import { unstable_rethrow } from "next/navigation";

// Register this browser's FCM token for the logged-in user's push notifications
export async function registerDevice(
  token: string,
): Promise<{ success: boolean }> {
  console.log(token);
  try {
    await http.post("/api/devices", { token, platform: "web" });
    return { success: true };
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error registering device for push notifications:", error);
    return { success: false };
  }
}

// Stop sending push notifications to this browser's FCM token. Needs the
// auth cookie, so call it before logging out.
export async function unregisterDevice(
  token: string,
): Promise<{ success: boolean }> {
  try {
    await http.delete(`/api/devices/${encodeURIComponent(token)}`);
    return { success: true };
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error unregistering device for push notifications:", error);
    return { success: false };
  }
}
