// "use server";

import { OtpFormValues } from "@/types/otp";
import { http, ValidationError } from "./http";
import { SignUpFormValues } from "@/types/sign-up";
import {
  SignInWithEmailFormValues,
  SignInWithPhoneFormValues,
} from "@/types/sign-in";
import { ResetPasswordFormValues } from "@/types/reset-password";
import { ForgotPasswordFormValues } from "@/types/forgot-password";
import { AuthFormActionsResponse, GuestType, User } from "@/types/shared";

// Convert a failed request into a form response. Validation errors (422) are
// expected and returned to the form; anything else is logged.
function toFailure<T>(
  error: unknown,
  context: string,
): Extract<AuthFormActionsResponse<T>, { success: false }> {
  if (error instanceof ValidationError) {
    const errors = Object.fromEntries(
      Object.entries(error.errors).map(([field, messages]) => [
        field,
        messages[0] ?? "Invalid value",
      ]),
    ) as Partial<Record<keyof T, string>>;

    return { success: false, errors, message: error.responseMessage };
  }

  console.error(context, error);

  return { success: false };
}

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
    return toFailure(error, "Error signing up with email and password:");
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
    return toFailure(error, "Error logging in with email and password:");
  }
}

// Get Otp Code By Phone
type LoginWithPhoneResponse =
  AuthFormActionsResponse<SignInWithPhoneFormValues>;

export async function loginWithPhone(
  formData: SignInWithPhoneFormValues,
): Promise<LoginWithPhoneResponse> {
  try {
    const { data } = await http.post<{
      message: string;
    }>("/api/auth/login/phone/request", formData);

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return toFailure(error, "Error requesting phone sign-in code:");
  }
}

// Verify Phone Otp
type VerifyOtpPhoneResponse = AuthFormActionsResponse<OtpFormValues>;

export async function verifyPhoneOtp(
  formData: OtpFormValues,
  phone: string,
): Promise<VerifyOtpPhoneResponse> {
  try {
    const { data } = await http.post<{
      token: string;
      user: User;
    }>("/api/auth/login/phone/verify", {
      ...formData,
      phone,
      remember: true,
    });
    return { success: true, token: data.token, user: data.user };
  } catch (error) {
    return toFailure(error, "Error verifying OTP:");
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
    return toFailure(error, "Error sending forgot password request:");
  }
}

// Reset password
type ResetPasswordResponse = AuthFormActionsResponse<ResetPasswordFormValues>;

export async function resetPassword(
  formData: ResetPasswordFormValues,
): Promise<ResetPasswordResponse> {
  try {
    await http.post("/api/auth/reset-password", formData);

    return { success: true };
  } catch (error) {
    return toFailure(error, "Error resetting password:");
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
    return toFailure(error, "Error verifying OTP:");
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
