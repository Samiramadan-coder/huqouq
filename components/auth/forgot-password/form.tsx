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
import { forgotPassword } from "@/lib/auth";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";

export function ForgotPasswordForm() {
  const t = useTranslations("ForgotPassword");
  const locale = useLocale();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema(t)),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    const result = await forgotPassword(data);

    if (result.success) {
      toast.success(t("successMessage"));
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        setError(field as keyof ForgotPasswordFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(t("errorMessage"));
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo />

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
        className="sm:col-span-2"
        register={register}
        required
        errors={errors}
      />

      <div className="space-y-4">
        <SubmitBtn label={t("submit")} loading={isSubmitting} />

        <Button
          variant="ghost"
          type="button"
          className="w-full hover:bg-transparent text-secondary"
        >
          <Link href="/sign-in">{t("backToSignIn")}</Link>
        </Button>
      </div>
    </form>
  );
}
