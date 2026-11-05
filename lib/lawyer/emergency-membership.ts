"use server";

import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { http, ValidationError } from "../http";
import { Plan } from "@/types/lawyer/emergency-membership";

// Activate Membership Plan
type ActivatePlanResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function activatePlan(
  plan: Plan["id"],
): Promise<ActivatePlanResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      "/api/lawyer/emergency/membership/activate",
      { plan },
    );

    updateTag("emergency-membership");
    return { success: true, message: data.message };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ValidationError) {
      const firstError = Object.values(error.errors)[0]?.[0];
      return {
        success: false,
        message: error.responseMessage ?? firstError,
      };
    }
    console.error("Error activating emergency membership:", error);
    return { success: false };
  }
}
