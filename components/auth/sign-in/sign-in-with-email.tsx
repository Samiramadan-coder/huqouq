"use client";

import {
  signInWithEmailSchema,
  SignInWithEmailFormValues,
} from "@/types/sign-in";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";
import OtpDialog from "../shared/otp-dialog";
import { Dialog } from "@/components/ui/dialog";
import { Link, useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { login, resendOtp } from "@/lib/auth";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import PasswordToggle from "../shared/password-toggle";
import { useUser } from "@/providers/user-provider";
import { saveToken } from "@/lib/cookies";
import { User } from "@/types/shared";

export function SignInWithEmail() {
  const router = useRouter();
  const { setUser } = useUser();
  const t = useTranslations("SignIn");
  const [token, setToken] = useState<string>("");
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInWithEmailFormValues>({
    resolver: zodResolver(signInWithEmailSchema(t)),
    defaultValues: {
      login: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit: SubmitHandler<SignInWithEmailFormValues> = async (data) => {
    const result = await login(data);

    if (result.success) {
      if (!result.token || !result.user) {
        toast.error(t("signInError"));
        return;
      }

      if (result.user.phone_verified === false) {
        await resendOtp(result.token);
        setToken(result.token);
        setPendingUser(result.user);
        setIsOtpDialogOpen(true);
        return;
      }

      setUser(result.user);
      await saveToken(result.token);
      toast.success(t("LoginSuccess"));
      router.push(`/${result.user.role}/dashboard`);
      return;
    }

    const fieldErrors = Object.entries(result.errors ?? {}).filter(
      ([, message]) => message,
    );

    if (fieldErrors.length) {
      fieldErrors.forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof SignInWithEmailFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(result.message ?? t("signInError"));
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          name="login"
          type="email"
          autoComplete="email"
          placeholder={t("fields.email.placeholder")}
          label={t("fields.email.label")}
          className="sm:col-span-2"
          register={register}
          required
          errors={errors}
        />

        <div className="space-y-2">
          <FormInput
            name="password"
            autoComplete="current-password"
            placeholder={t("fields.password.placeholder")}
            label={t("fields.password.label")}
            type={showPassword ? "text" : "password"}
            className="sm:col-span-2"
            register={register}
            required
            errors={errors}
            suffix={
              <PasswordToggle
                visible={showPassword}
                onToggle={() => setShowPassword((visible) => !visible)}
                showLabel={t("showPassword")}
                hideLabel={t("hidePassword")}
              />
            }
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-accent text-xs hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
        </div>

        <SubmitBtn label={t("signIn")} loading={isSubmitting} />
      </form>

      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <OtpDialog token={token} user={pendingUser} />
      </Dialog>
    </>
  );
}
