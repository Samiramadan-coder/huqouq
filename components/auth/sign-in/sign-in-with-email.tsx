"use client";

import {
  signInWithEmailSchema,
  SignInWithEmailFormValues,
} from "@/types/sign-in";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import OtpDialog from "../shared/otp-dialog";
import { Dialog } from "@/components/ui/dialog";
import { Link, useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { login, resendOtp } from "@/lib/auth";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";

export function SignInWithEmail() {
  const router = useRouter();
  const t = useTranslations("SignIn");
  const [token, setToken] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInWithEmailFormValues>({
    resolver: zodResolver(signInWithEmailSchema(t)),
    defaultValues: {
      login: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit: SubmitHandler<SignInWithEmailFormValues> = async (data) => {
    const result = await login(data);

    if (result.success) {
      if (result.phone_verified === false) {
        await resendOtp(result.token || "");
        setToken(result.token || "");
        setIsOtpDialogOpen(true);
        return;
      }

      toast.success(t("LoginSuccess"));
      router.push("/");
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof SignInWithEmailFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(t("signInError"));
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          name="login"
          placeholder={t("fields.email.placeholder")}
          label={t("fields.email.label")}
          className="sm:col-span-2"
          register={register}
          required
          errors={errors}
        />

        <div className="space-y-2">
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
                  aria-label="Hide password"
                  className="size-5 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <EyeOff
                  role="button"
                  tabIndex={0}
                  aria-label="Show password"
                  className="size-5 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )
            }
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-secondary text-xs">
              {t("forgotPassword")}
            </Link>
          </div>
        </div>

        <SubmitBtn label={t("signIn")} loading={isSubmitting} />
      </form>

      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <OtpDialog token={token} />
      </Dialog>
    </>
  );
}
