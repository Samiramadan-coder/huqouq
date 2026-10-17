"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";
import { PayoutDetailsFormValues } from "@/types/lawyer/settings";

// Update payout details response type
type UpdatePayoutDetailsResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof PayoutDetailsFormValues, string>>;
    };

// Updates the bank account the lawyer's earnings are paid out to
export async function updatePayoutDetails(
  values: PayoutDetailsFormValues,
): Promise<UpdatePayoutDetailsResponse> {
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
      ) as Partial<Record<keyof PayoutDetailsFormValues, string>>;

      return { success: false, errors, message: error.responseMessage };
    }

    console.error("Error updating payout details:", error);
    return { success: false };
  }
}
