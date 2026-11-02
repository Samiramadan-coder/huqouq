import { http } from "../http";
import { toFailure } from "../auth";
import { unstable_rethrow } from "next/navigation";
import { ChangePasswordFormValues } from "@/types/client/settings";

type ChangePasswordResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
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
