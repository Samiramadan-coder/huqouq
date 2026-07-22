"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import FormInput from "@/components/shared/form/form-input";
import SubmitBtn from "@/components/shared/form/submit-btn";
import { SignUpFormValues, signUpSchema } from "@/types/sign-up";

export function SignInWithEmail() {
  const t = useTranslations("SignUp");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema(t)),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
      emirates_id: "",
      terms: false,
    },
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
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

      <div className="sm:col-span-2">
        <SubmitBtn label={"Sign In"} loading={false} />
      </div>
    </form>
  );
}
