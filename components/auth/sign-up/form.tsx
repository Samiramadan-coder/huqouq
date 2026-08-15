"use client";

import { toast } from "sonner";
import { useState } from "react";
import { signUp } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Eye, EyeOff } from "lucide-react";
import OtpDialog from "../shared/otp-dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import AuthLogo from "@/components/icons/auth-logo";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GuestType, User } from "@/types/shared";
import { useLocale, useTranslations } from "next-intl";
import { checkPasswordStrength, cn } from "@/lib/utils";
import { SignUpFormValues, signUpSchema } from "@/types/sign-up";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormSelect from "@/components/public/shared/form/form-select";
import { Controller, useForm, SubmitHandler, useWatch } from "react-hook-form";

export default function SignUpForm({ guestType }: { guestType: GuestType }) {
  const locale = useLocale();
  const t = useTranslations("SignUp");
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
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

  const password = useWatch({ control, name: "password" });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    const result = await signUp(data, guestType);

    if (result.success) {
      setToken(result.token ?? "");
      setUser(result.user ?? null);
      return setIsOtpDialogOpen(true);
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
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
        <div className="flex flex-col items-center gap-3 sm:col-span-2">
          <AuthLogo />

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

        <div className="sm:col-span-2">
          <FormInput
            name="password"
            placeholder={t("fields.password.placeholder")}
            label={t("fields.password.label")}
            type={showPassword ? "text" : "password"}
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
                <div className="flex items-start gap-1">
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
                    className="cursor-pointer text-[12px] sm:text-sm font-normal leading-6 text-muted-foreground gap-0.5 sm:gap-1"
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

        <div className="flex gap-3 items-center sm:col-span-2">
          <Button
            variant="outline"
            className="flex-1 bg-transparent h-10 rounded-sm border-[#c8c0b0] font-normal text-[13px]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              ></path>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              ></path>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              ></path>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              ></path>
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-transparent h-10 rounded-sm border-[#c8c0b0] font-normal text-[13px]"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="#1B3A57"
              aria-hidden="true"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"></path>
            </svg>
            Apple
          </Button>
        </div>

        <p className="text-center text-xs text-primary/80 sm:col-span-2">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/sign-in" className="text-secondary hover:underline">
            {t("signIn")}
          </Link>
        </p>
      </form>

      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <OtpDialog token={token} user={user} />
      </Dialog>
    </>
  );
}
