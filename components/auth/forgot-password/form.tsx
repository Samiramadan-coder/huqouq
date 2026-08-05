"use client";

import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/types/forgot-password";
import { cn } from "@/lib/utils";
import Logo from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormInput from "@/components/public/shared/form/form-input";

export function ForgotPasswordForm() {
  const t = useTranslations("ForgotPassword");
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema(t)),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
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
        className="sm:col-span-2"
        register={register}
        required
        errors={errors}
      />

      <div className="space-y-4">
        <SubmitBtn label={t("submit")} loading={false} />

        <Button
          variant="ghost"
          type="button"
          className="w-full hover:bg-transparent text-secondary"
        >
          {t("backToSignIn")}
        </Button>
      </div>
    </form>
  );
}
