"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/types/reset-password";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import AuthLogo from "@/components/icons/auth-logo";

export default function ResetPasswordForm() {
  const locale = useLocale();
  const t = useTranslations("ResetPassword");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    console.log(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
        name="email"
        placeholder={t("fields.email.placeholder")}
        label={t("fields.email.label")}
        register={register}
        required
        errors={errors}
      />

      <FormInput
        name="password"
        placeholder={t("fields.newPassword.placeholder")}
        label={t("fields.newPassword.label")}
        type={showPassword ? "text" : "password"}
        register={register}
        required
        errors={errors}
        suffix={
          showPassword ? (
            <Eye
              role="button"
              tabIndex={0}
              aria-label={"hidePassword"}
              className="size-5 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeOff
              role="button"
              tabIndex={0}
              aria-label={"showPassword"}
              className="size-5 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )
        }
      />

      <FormInput
        name="password_confirmation"
        placeholder={t("fields.confirmNewPassword.placeholder")}
        label={t("fields.confirmNewPassword.label")}
        type={showPassword ? "text" : "password"}
        register={register}
        required
        errors={errors}
        suffix={
          showPassword ? (
            <Eye
              role="button"
              tabIndex={0}
              aria-label={"hidePassword"}
              className="size-5 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeOff
              role="button"
              tabIndex={0}
              aria-label={"showPassword"}
              className="size-5 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )
        }
      />

      <SubmitBtn label={t("submit")} loading={false} />

      <Button
        variant="ghost"
        type="button"
        className="w-full hover:bg-transparent text-secondary"
      >
        <Link href="/sign-in">{t("backToSignIn")}</Link>
      </Button>
    </form>
  );
}
