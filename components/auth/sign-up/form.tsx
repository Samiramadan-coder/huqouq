"use client";

import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/components/icons/logo";
import OtpDialog from "../shared/otp-dialog";
import { Label } from "@/components/ui/label";
import type { GuestType } from "@/types/shared";
import { Dialog } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { signUpWithEmailAndPassword } from "@/lib/auth";
import { SignUpFormValues, signUpSchema } from "@/types/sign-up";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormSelect from "@/components/public/shared/form/form-select";
import { Controller, useForm, SubmitHandler } from "react-hook-form";

export default function SignUpForm({ guestType }: { guestType: GuestType }) {
  const locale = useLocale();
  const t = useTranslations("SignUp");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const guestLabel =
    guestType === "client" ? t("guestTypes.client") : t("guestTypes.lawyer");

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema(t)),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
      country: "United Arab Emirates",
      city: "",
      terms_accepted: false,
    },
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    const result = await signUpWithEmailAndPassword(data, guestType);

    if (result.success) {
      return setIsOtpDialogOpen(true);
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        setError(field as keyof SignUpFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(t("signUpError"));
  };

  return (
    <>
      <form
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 sm:col-span-2">
          <Logo />

          <p className="text-xs text-foreground">
            {t("signingUpAs")}{" "}
            <span className="text-secondary">{guestLabel}</span> <span>·</span>{" "}
            <Link
              href="/get-started"
              className="text-secondary hover:underline"
            >
              {t("change")}
            </Link>
          </p>

          <h1
            className={cn(
              "mb-1 text-center text-[1.6rem] font-bold text-primary",
              { "font-lora": locale === "en" },
            )}
          >
            {t("title")}
          </h1>
        </div>

        <FormInput
          name="first_name"
          placeholder={t("fields.firstName.placeholder")}
          label={t("fields.firstName.label")}
          register={register}
          required
          errors={errors}
        />

        <FormInput
          name="last_name"
          placeholder={t("fields.lastName.placeholder")}
          label={t("fields.lastName.label")}
          register={register}
          required
          errors={errors}
        />

        <FormInput
          name="phone"
          placeholder={t("fields.phone.placeholder")}
          label={t("fields.phone.label")}
          className="sm:col-span-2"
          prefix="+971"
          register={register}
          required
          errors={errors}
        />

        <FormInput
          name="email"
          placeholder={t("fields.email.placeholder")}
          label={t("fields.email.label")}
          className="sm:col-span-2"
          register={register}
          required
          errors={errors}
        />

        <FormInput
          name="password"
          placeholder={t("fields.password.placeholder")}
          label={t("fields.password.label")}
          type={showPassword ? "text" : "password"}
          className="sm:col-span-2"
          register={register}
          required
          errors={errors}
          suffix={
            showPassword ? (
              <Eye
                role="button"
                tabIndex={0}
                aria-label={t("hidePassword")}
                className="size-5 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeOff
                role="button"
                tabIndex={0}
                aria-label={t("showPassword")}
                className="size-5 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )
          }
        />

        <FormInput
          name="password_confirmation"
          placeholder={t("fields.confirmPassword.placeholder")}
          label={t("fields.confirmPassword.label")}
          type={showPassword ? "text" : "password"}
          className="sm:col-span-2"
          register={register}
          required
          errors={errors}
          suffix={
            showPassword ? (
              <Eye
                role="button"
                tabIndex={0}
                aria-label={t("hidePassword")}
                className="size-5 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeOff
                role="button"
                tabIndex={0}
                aria-label={t("showPassword")}
                className="size-5 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )
          }
        />

        <FormSelect
          name="city"
          label={t("fields.city.label")}
          placeholder={t("fields.city.placeholder")}
          control={control}
          options={[
            {
              label: t("city.dubai"),
              value: "dubai",
            },
            {
              label: t("city.abuDhabi"),
              value: "abu-dhabi",
            },
            {
              label: t("city.sharjah"),
              value: "sharjah",
            },
            {
              label: t("city.ajman"),
              value: "ajman",
            },
            {
              label: t("city.ummAlQuwain"),
              value: "umm-al-quwain",
            },
            {
              label: t("city.rasAlKhaimah"),
              value: "ras-al-khaimah",
            },
            {
              label: t("city.fujairah"),
              value: "fujairah",
            },
          ]}
          className="sm:col-span-2"
          required
        />

        <div className="sm:col-span-2">
          <Controller
            name="terms_accepted"
            control={control}
            render={({ field }) => (
              <>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true);
                    }}
                    className="mt-0.5 size-4 rounded-[3px] border-border data-[state=checked]:border-secondary data-[state=checked]:bg-secondary"
                  />

                  <Label
                    htmlFor="terms"
                    className="cursor-pointer text-sm font-normal leading-6 text-muted-foreground"
                  >
                    {t.rich("termsAgreement", {
                      terms: (chunks) => (
                        <Link
                          href="/terms-of-use"
                          className="text-secondary hover:underline"
                        >
                          {chunks}
                        </Link>
                      ),
                      privacy: (chunks) => (
                        <Link
                          href="/privacy-policy"
                          className="text-secondary hover:underline"
                        >
                          {chunks}
                        </Link>
                      ),
                    })}
                  </Label>
                </div>

                <FieldError errors={[errors.terms_accepted]} />
              </>
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <SubmitBtn label={t("createAccount")} loading={isSubmitting} />
        </div>

        <div className="relative border-t border-border sm:col-span-2">
          <span className="absolute left-1/2 -top-2 -translate-x-1/2 inline-block bg-white px-2 text-xs text-border">
            {t("continueWith")}
          </span>
        </div>

        <div className="text-center text-xs text-muted-foreground sm:col-span-2">
          {t("socialSignUp")}
        </div>

        <p className="text-center text-xs text-primary/80 sm:col-span-2">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/sign-in" className="text-secondary hover:underline">
            {t("signIn")}
          </Link>
        </p>
      </form>

      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <OtpDialog place="email" />
      </Dialog>
    </>
  );
}
