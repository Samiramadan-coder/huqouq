import { http } from "../http";
import { toFailure } from "../auth";
import { unstable_rethrow } from "next/navigation";
import {
  ChangePasswordFormValues,
  DeleteAccountFormValues,
} from "@/types/client/settings";

type ChangePasswordResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof ChangePasswordFormValues, string>>;
    };

export async function changePassword(
  values: ChangePasswordFormValues,
): Promise<ChangePasswordResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      "/api/auth/change-password",
      values,
    );

    return { success: true, message: data.message };
  } catch (error) {
    unstable_rethrow(error);
    return toFailure(error, "Error changing password");
  }
}

// Delete account
type RequestDeletionCodeResponse =
  | { success: true; message?: string }
  | { success: false; message?: string };

export async function requestDeletionCode(): Promise<RequestDeletionCodeResponse> {
  try {
    const { data } = await http.post<{ message?: string }>(
      "/api/account/deletion-code",
    );

    return { success: true, message: data?.message };
  } catch (error) {
    unstable_rethrow(error);
    return toFailure(error, "Error requesting account deletion code");
  }
}

type DeleteAccountResponse =
  | { success: true; message?: string }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof DeleteAccountFormValues, string>>;
    };

export async function deleteAccount(
  values: DeleteAccountFormValues,
): Promise<DeleteAccountResponse> {
  try {
    const { data } = await http.delete<{ message?: string }>(
      `/api/account?password=${values.password}&reason=${values.reason}`,
    );

    return { success: true, message: data?.message };
  } catch (error) {
    unstable_rethrow(error);
    return toFailure(error, "Error deleting account");
  }
}
