"use server";

import { http, ValidationError } from "./http";
import { FormActionsResponse } from "@/types/shared";
import { SignInWithEmailFormValues } from "@/types/sign-in";

// Login with email and password response type
type LoginWithEmailAndPasswordResponse =
  FormActionsResponse<SignInWithEmailFormValues>;

export async function loginWithEmailAndPassword(
  data: SignInWithEmailFormValues,
): Promise<LoginWithEmailAndPasswordResponse> {
  try {
    await http.post("/api/v1/auth/login", data);
    return { success: true };
  } catch (error) {
    console.error("Error logging in with email and password:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof SignInWithEmailFormValues, string>>;
      return { success: false, errors };
    }
    return { success: false };
  }
}
