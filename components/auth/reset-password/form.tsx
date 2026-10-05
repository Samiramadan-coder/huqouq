"use client";

import { toast } from "sonner";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/types/reset-password";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import AuthLogo from "@/components/icons/auth-logo";
import { resetPassword } from "@/lib/auth";
import PasswordToggle from "../shared/password-toggle";
import PasswordStrength from "../shared/password-strength";

export default function ResetPasswordForm({
  defaultPhone = "",
}: {
  defaultPhone?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ResetPassword");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema(t)),
    defaultValues: {
      phone: defaultPhone,
      code: "",
      password: "",
      password_confirmation: "",
    },
  });

  const password = useWatch({ control, name: "password" });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    const result = await resetPassword(data);

    if (result.success) {
      toast.success(t("successMessage"));
      router.push("/sign-in");
      return;
    }

    const fieldErrors = Object.entries(result.errors ?? {}).filter(
      ([, message]) => message,
    );

    if (fieldErrors.length) {
      fieldErrors.forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof ResetPasswordFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(result.message ?? t("errorMessage"));
  };

  const passwordToggle = (
    <PasswordToggle
      visible={showPassword}
      onToggle={() => setShowPassword((visible) => !visible)}
      showLabel={t("showPassword")}
      hideLabel={t("hidePassword")}
    />
  );

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col items-center gap-3 text-center">
        <AuthLogo />

        <h1
          className={cn(
            "mb-1 text-center text-[1.6rem] font-bold text-primary",
            { "font-lora": locale === "en" },
          )}
        >
          {t("title")}
        </h1>

        <p className="text-sm text-foreground leading-relaxed">
          {t("description")}
        </p>
      </div>

      <FormInput
        name="phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        dir="ltr"
        placeholder={t("fields.phone.placeholder")}
        label={t("fields.phone.label")}
        prefix="+971"
        register={register}
        required
        errors={errors}
      />

      <div className="space-y-2">
        <FormInput
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          dir="ltr"
          placeholder={t("fields.code.placeholder")}
          label={t("fields.code.label")}
          register={register}
          required
          errors={errors}
        />
        <p className="text-xs text-primary/80">
          {t("noCode")}{" "}
          <Link href="/forgot-password" className="text-accent hover:underline">
            {t("requestNewCode")}
          </Link>
        </p>
      </div>

      <div>
        <FormInput
          name="password"
          autoComplete="new-password"
          placeholder={t("fields.newPassword.placeholder")}
          label={t("fields.newPassword.label")}
          type={showPassword ? "text" : "password"}
          register={register}
          required
          errors={errors}
          suffix={passwordToggle}
        />
        <PasswordStrength
          password={password}
          labels={{
            weak: t("passwordStrength.weak"),
            medium: t("passwordStrength.medium"),
            strong: t("passwordStrength.strong"),
          }}
        />
      </div>

      <FormInput
        name="password_confirmation"
        autoComplete="new-password"
        placeholder={t("fields.confirmNewPassword.placeholder")}
        label={t("fields.confirmNewPassword.label")}
        type={showPassword ? "text" : "password"}
        register={register}
        required
        errors={errors}
        suffix={passwordToggle}
      />

      <SubmitBtn label={t("submit")} loading={isSubmitting} />

      <Button
        asChild
        variant="ghost"
        className="w-full hover:bg-transparent text-accent"
      >
        <Link href="/sign-in">{t("backToSignIn")}</Link>
      </Button>
    </form>
  );
}
