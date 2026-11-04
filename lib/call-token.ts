import { unstable_rethrow } from "next/navigation";
import { http, HttpError } from "./http";
import type { CallTokenData } from "@/components/client-lawyer/reusable/call/config";

export type CallTokenResponse =
  | { success: true; data: CallTokenData }
  | { success: false; status?: number; message?: string };

// Shared by the client and lawyer call-token server actions.
export async function fetchCallToken(path: string): Promise<CallTokenResponse> {
  try {
    const { data } = await http.post<CallTokenData | { data: CallTokenData }>(
      path,
    );

    // Accept both a bare object and a resource wrapped in `data`.
    const token = "data" in data ? data.data : data;
    return { success: true, data: token };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof HttpError) {
      return {
        success: false,
        status: error.status,
        message: error.responseMessage,
      };
    }

    console.error("Error requesting call token:", error);
    return { success: false };
  }
}
