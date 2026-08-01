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
import Logo from "@/components/icons/logo";
import { cn } from "@/lib/utils";

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
      <div className="flex flex-col items-center gap-2 text-center">
        <Logo />
        <h1
          className={cn(
            "mb-1 text-center text-[1.6rem] font-bold text-primary",
            { "font-lora": locale === "en" },
          )}
        >
          {t("title")}
        </h1>
        <p className="text-sm text-foreground">{t("description")}</p>
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
    </form>
  );
}
