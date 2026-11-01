"use client";

import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signUp } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import OtpDialog from "../shared/otp-dialog";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import AuthLogo from "@/components/icons/auth-logo";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GuestType, User } from "@/types/shared";
import { useLocale, useTranslations } from "next-intl";
import PasswordToggle from "../shared/password-toggle";
import PasswordStrength from "../shared/password-strength";
import { SignUpFormValues, signUpSchema } from "@/types/sign-up";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormSelect from "@/components/public/shared/form/form-select";
import { useReferenceData } from "@/providers/reference-data.provider";
import { Controller, useForm, SubmitHandler, useWatch } from "react-hook-form";

export default function SignUpForm({ guestType }: { guestType: GuestType }) {
  const locale = useLocale();
  const t = useTranslations("SignUp");
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const { referenceData } = useReferenceData();
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

    const fieldErrors = Object.entries(result.errors ?? {}).filter(
      ([, message]) => message,
    );

    if (fieldErrors.length) {
      fieldErrors.forEach(([field, message]) => {
        toast.error(message);
        setError(field as keyof SignUpFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(result.message ?? t("signUpError"));
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
    <>
      <form
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col items-center gap-3 sm:col-span-2">
          <AuthLogo />

          <p className="text-xs text-foreground">
            {t("signingUpAs")} <span className="text-accent">{guestLabel}</span>{" "}
            <span>·</span>{" "}
            <Link href="/get-started" className="text-accent hover:underline">
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
          autoComplete="given-name"
          placeholder={t("fields.firstName.placeholder")}
          label={t("fields.firstName.label")}
          register={register}
          required
          errors={errors}
        />

        <FormInput
          name="last_name"
          autoComplete="family-name"
          placeholder={t("fields.lastName.placeholder")}
          label={t("fields.lastName.label")}
          register={register}
          required
          errors={errors}
        />

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

        <FormInput
          name="email"
          type="email"
          autoComplete="email"
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
            autoComplete="new-password"
            placeholder={t("fields.password.placeholder")}
            label={t("fields.password.label")}
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
          placeholder={t("fields.confirmPassword.placeholder")}
          label={t("fields.confirmPassword.label")}
          type={showPassword ? "text" : "password"}
          className="sm:col-span-2"
          register={register}
          required
          errors={errors}
          suffix={passwordToggle}
        />

        <FormSelect
          name="city"
          label={t("fields.city.label")}
          placeholder={t("fields.city.placeholder")}
          control={control}
          options={
            referenceData?.cities.map((city) => ({
              label: city.emirate_label,
              value: city.emirate,
            })) || []
          }
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
                    aria-invalid={!!errors.terms_accepted}
                    aria-describedby={
                      errors.terms_accepted ? "terms-error" : undefined
                    }
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true);
                    }}
                    className="mt-0.5 size-4 rounded-[3px] border-border data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                  />

                  <Label
                    htmlFor="terms"
                    className="cursor-pointer text-[12px] sm:text-sm font-normal leading-6 text-muted-foreground gap-0.5 sm:gap-1"
                  >
                    {t.rich("termsAgreement", {
                      terms: (chunks) => (
                        <Link
                          href="/terms"
                          target="_blank"
                          className="text-accent hover:underline"
                        >
                          {chunks}
                        </Link>
                      ),
                      privacy: (chunks) => (
                        <Link
                          href="/privacy"
                          target="_blank"
                          className="text-accent hover:underline"
                        >
                          {chunks}
                        </Link>
                      ),
                    })}
                  </Label>
                </div>

                <FieldError id="terms-error" errors={[errors.terms_accepted]} />
              </>
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <SubmitBtn label={t("createAccount")} loading={isSubmitting} />
        </div>

        <p className="text-center text-xs text-primary/80 sm:col-span-2">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/sign-in" className="text-accent hover:underline">
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
