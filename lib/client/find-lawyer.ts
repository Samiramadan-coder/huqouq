"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";

// Publish Case
type PublishCaseResponse =
  | { success: true; message?: string }
  | { success: false; message?: string };

export async function sendToLawyer(
  caseId: number,
  lawyerId: number,
): Promise<PublishCaseResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/cases/${caseId}/send-to-lawyer`,
      { lawyer_id: lawyerId },
    );

    updateTag(`cases`);
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error sending the case to the lawyer:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}
