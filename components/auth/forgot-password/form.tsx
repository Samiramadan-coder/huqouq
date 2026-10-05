"use client";

import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/types/forgot-password";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { forgotPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import AuthLogo from "@/components/icons/auth-logo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormInput from "@/components/public/shared/form/form-input";

export function ForgotPasswordForm() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ForgotPassword");

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema(t)),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    const result = await forgotPassword(data);

    if (result.success) {
      toast.success(t("successMessage"));
      router.push({ pathname: "/reset-password", query: { phone: data.phone } });
      return;
    }

    const fieldErrors = Object.entries(result.errors ?? {}).filter(
      ([, message]) => message,
    );

    if (fieldErrors.length) {
      fieldErrors.forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof ForgotPasswordFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(result.message ?? t("errorMessage"));
  };

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
        className="sm:col-span-2"
        prefix="+971"
        register={register}
        required
        errors={errors}
      />

      <div className="space-y-4">
        <SubmitBtn label={t("submit")} loading={isSubmitting} />

        <Button
          asChild
          variant="ghost"
          className="w-full hover:bg-transparent text-accent"
        >
          <Link href="/sign-in">{t("backToSignIn")}</Link>
        </Button>
      </div>
    </form>
  );
}
