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
      `/api/cases/${caseId}/request-closure`,
    );

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error marking case as complete:", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.responseMessage };
    }
    return { success: false };
  }
}
