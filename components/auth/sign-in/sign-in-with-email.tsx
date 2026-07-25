"use client";

import {
  SignInWithEmailFormValues,
  signInWithEmailSchema,
} from "@/types/sign-in";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import FormInput from "@/components/shared/form/form-input";
import SubmitBtn from "@/components/shared/form/submit-btn";
import { Link } from "@/i18n/navigation";

export function SignInWithEmail() {
  const t = useTranslations("SignIn");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInWithEmailFormValues>({
    resolver: zodResolver(signInWithEmailSchema(t)),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<SignInWithEmailFormValues> = async (data) => {
    console.log(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        name="email"
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

      <div className="sm:col-span-2">
        <SubmitBtn label={"Sign In"} loading={false} />
      </div>
    </form>
  );
}
