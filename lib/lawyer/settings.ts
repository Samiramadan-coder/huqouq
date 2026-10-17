"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";
import type { PayoutDetailsSchemaType } from "@/components/client-lawyer/lawyer/settings/payout-details";

type PayoutResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors?: Partial<Record<keyof PayoutDetailsSchemaType, string>>;
    };

export async function updatePayoutDetails(
  values: PayoutDetailsSchemaType,
): Promise<PayoutResponse> {
  try {
    const { data } = await http.put<{ message: string }>(
      "/api/lawyer/payout-details",
      values,
    );

    updateTag("payout-details");
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof PayoutDetailsSchemaType, string>>;

      return { success: false, errors };
    }

    console.error("Error updating payout details:", error);
    return { success: false };
  }
}
