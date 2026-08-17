"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/types/reset-password";
import { checkPasswordStrength, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import AuthLogo from "@/components/icons/auth-logo";
import { resetPassword } from "@/lib/auth";

export default function ResetPasswordForm() {
  const locale = useLocale();
  const t = useTranslations("ResetPassword");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const password = useWatch({ control, name: "password" });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    const result = await resetPassword(data);

    if (result.success) {
      return;
    }
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

      <div>
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
        {password &&
          (() => {
            const strength = checkPasswordStrength(password || "");

            return (
              <div className="relative mt-1 flex items-center gap-4">
                <div className="flex w-full gap-1 relative">
                  {Array.from({ length: 4 }).map((_, index) => {
                    const segmentFill = Math.min(
                      Math.max(strength.score - index * 25, 0),
                      25,
                    );

                    return (
                      <div
                        key={index}
                        className="h-0.5 flex-1 overflow-hidden rounded-full bg-gray-200"
                      >
                        <div
                          className="h-full transition-all duration-300 ease-out"
                          style={{
                            width: `${(segmentFill / 25) * 100}%`,
                            backgroundColor: strength.color,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mb-1 flex items-center justify-between">
                  <div className="flex-1" />

                  <p
                    className="text-[11px] font-medium"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </p>
                </div>
              </div>
            );
          })()}
      </div>

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
        className="w-full hover:bg-transparent text-accent"
      >
        <Link href="/sign-in">{t("backToSignIn")}</Link>
      </Button>
    </form>
  );
}
