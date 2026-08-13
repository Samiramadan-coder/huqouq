"use server";

import { OtpFormValues } from "@/types/otp";
import { http, ValidationError } from "./http";
import { SignUpFormValues } from "@/types/sign-up";
import { SignInWithEmailFormValues } from "@/types/sign-in";
import { ResetPasswordFormValues } from "@/types/reset-password";
import { ForgotPasswordFormValues } from "@/types/forgot-password";
import { AuthFormActionsResponse, GuestType, User } from "@/types/shared";

// Sign up
type SignUpResponse = AuthFormActionsResponse<SignUpFormValues>;

export async function signUp(
  formData: SignUpFormValues,
  guestType: GuestType,
): Promise<SignUpResponse> {
  try {
    const { data } = await http.post<{ token: string; user: User }>(
      `/api/auth/register/${guestType}`,
      formData,
    );

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
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
type LoginResponse = AuthFormActionsResponse<SignInWithEmailFormValues>;

export async function login(
  formData: SignInWithEmailFormValues,
): Promise<LoginResponse> {
  try {
    const { data } = await http.post<{
      token: string;
      user: User;
    }>("/api/auth/login", formData);

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
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
type ForgotPasswordResponse = AuthFormActionsResponse<ForgotPasswordFormValues>;

export async function forgotPassword(
  formData: ForgotPasswordFormValues,
): Promise<ForgotPasswordResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      "/api/auth/forgot-password",
      formData,
    );

    return { success: true, message: data.message };
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
type ResetPasswordResponse = AuthFormActionsResponse<ResetPasswordFormValues>;

export async function resetPassword(
  formData: ResetPasswordFormValues,
): Promise<ResetPasswordResponse> {
  try {
    const { data } = await http.post("/api/auth/reset-password", formData);
    console.log("Reset password response data:", data);

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
    await http.post("/api/auth/logout");
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false };
  }
}

// Verify Otp
type VerifyOtpResponse = AuthFormActionsResponse<OtpFormValues>;

export async function verifyOtp(
  data: OtpFormValues,
  token: string,
): Promise<VerifyOtpResponse> {
  try {
    await http.post("/api/auth/phone/verify", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

// Resend Otp
type ResendOtpResponse = { success: boolean };

export async function resendOtp(token: string): Promise<ResendOtpResponse> {
  try {
    await http.post("/api/auth/phone/resend", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error resending OTP:", error);
    return { success: false };
  }
}
