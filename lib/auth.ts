// "use server";

import { http, ValidationError } from "./http";
import { SignUpFormValues } from "@/types/sign-up";
import { FormActionsResponse, GuestType } from "@/types/shared";
import { SignInWithEmailFormValues } from "@/types/sign-in";
import { ResetPasswordFormValues } from "@/types/reset-password";
import { ForgotPasswordFormValues } from "@/types/forgot-password";
import { OtpFormValues } from "@/types/otp";

// Sign up
type SignUpWithEmailAndPasswordResponse = FormActionsResponse<SignUpFormValues>;

export async function signUpWithEmailAndPassword(
  data: SignUpFormValues,
  guestType: GuestType,
): Promise<SignUpWithEmailAndPasswordResponse> {
  try {
    await http.post(`/api/auth/register/${guestType}`, data);
    return { success: true };
  } catch (error) {
    console.error("Error signing up with email and password:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof SignUpFormValues, string>>;
      return { success: false, errors };
    }

    return { success: false };
  }
}

// Sign in
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

// Forgot password
type ForgotPasswordResponse = FormActionsResponse<ForgotPasswordFormValues>;

export async function forgotPassword(
  data: ForgotPasswordFormValues,
): Promise<ForgotPasswordResponse> {
  try {
    await http.post("/api/v1/auth/forgot-password", data);
    return { success: true };
  } catch (error) {
    console.error("Error sending forgot password request:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof ForgotPasswordFormValues, string>>;

      return { success: false, errors };
    }

    return { success: false };
  }
}

// Reset password
type ResetPasswordResponse = FormActionsResponse<ResetPasswordFormValues>;

export async function resetPassword(
  data: ResetPasswordFormValues,
): Promise<ResetPasswordResponse> {
  try {
    await http.post("/api/v1/auth/reset-password", data);
    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof ResetPasswordFormValues, string>>;

      return { success: false, errors };
    }

    return { success: false };
  }
}

// Sign out
type SignOutResponse = { success: boolean };

export async function signOut(): Promise<SignOutResponse> {
  try {
    await http.post("/api/v1/auth/logout");
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false };
  }
}

// Verify Otp
type VerifyOtpResponse = FormActionsResponse<OtpFormValues>;

export async function verifyOtp(
  data: OtpFormValues & { email?: string; phone?: string },
): Promise<VerifyOtpResponse> {
  try {
    await http.post("/api/v1/auth/verify-otp", data);
    return { success: true };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof OtpFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}
