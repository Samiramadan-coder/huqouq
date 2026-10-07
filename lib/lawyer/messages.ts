"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "../http";

// Mark Case as Complete
type MarkAsCompleteResponse =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function markCaseAsComplete(
  caseId: number,
): Promise<MarkAsCompleteResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/lawyer/my-cases/${caseId}/request-closure`,
    );

    updateTag("lawyer-my-cases");
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error marking case as complete:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}
