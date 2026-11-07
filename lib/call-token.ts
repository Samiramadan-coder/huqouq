import { http, HttpError } from "./http";
import { unstable_rethrow } from "next/navigation";
import type { CallTokenData } from "@/components/client-lawyer/reusable/call/config";

export type CallTokenResponse =
  | { success: true; data: CallTokenData }
  | { success: false; status?: number; message?: string };

// Shared by the call-token server actions (consultations: POST, emergency: GET).
export async function fetchCallToken(
  path: string,
  method: "get" | "post" = "post",
): Promise<CallTokenResponse> {
  try {
    const { data } =
      method === "get"
        ? await http.get<CallTokenData | { data: CallTokenData }>(path)
        : await http.post<CallTokenData | { data: CallTokenData }>(path);

    // console.log(data);

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
