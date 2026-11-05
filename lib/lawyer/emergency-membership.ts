"use server";

import {
  Plan,
  ChangePlanFormValues,
  UpdateAvailabilityPayload,
} from "@/types/lawyer/emergency-membership";
import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { http, ValidationError } from "../http";

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
    updateTag("emergency-availability");
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

// Cancel Membership
type CancelMembershipResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function cancelMembership(): Promise<CancelMembershipResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      "/api/lawyer/emergency/membership/cancel",
    );

    updateTag("emergency-membership");
    updateTag("emergency-availability");
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
    console.error("Error cancelling emergency membership:", error);
    return { success: false };
  }
}

// Emergency Availability (go live / go offline)
type UpdateAvailabilityResponse =
  { success: true; message?: string } | { success: false; message?: string };

export async function updateAvailability(
  values: UpdateAvailabilityPayload,
): Promise<UpdateAvailabilityResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      "/api/lawyer/emergency/availability",
      values,
    );

    updateTag("emergency-availability");
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
    console.error("Error updating emergency availability:", error);
    return { success: false };
  }
}

// Change Plan (takes effect at the end of the current period)
type ChangePlanResponse =
  | { success: true; message?: string }
  | {
      success: false;
      errors?: Partial<Record<keyof ChangePlanFormValues, string>>;
      message?: string;
    };

export async function changePlan(
  values: ChangePlanFormValues,
): Promise<ChangePlanResponse> {
  try {
    const { data } = await http.put<{ message: string }>(
      "/api/lawyer/emergency/membership/plan",
      values,
    );

    updateTag("emergency-membership");
    return { success: true, message: data.message };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof ChangePlanFormValues, string>>;
      return { success: false, errors, message: error.responseMessage };
    }
    console.error("Error changing emergency membership plan:", error);
    return { success: false };
  }
}

// Auto Renew Plan
type AutoRenewResponse =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      message?: string;
    };

export async function autoRenewPlan(
  value: boolean,
): Promise<AutoRenewResponse> {
  try {
    const { data } = await http.put<{ message: string }>(
      "/api/lawyer/emergency/membership/auto-renew",
      { on: value },
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
    console.error("Error updating emergency membership auto-renew:", error);
    return { success: false };
  }
}
