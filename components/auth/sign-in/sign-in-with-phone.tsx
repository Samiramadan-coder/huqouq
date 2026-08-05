"use client";

import {
  signInWithPhoneSchema,
  SignInWithPhoneFormValues,
} from "@/types/sign-in";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";

export function SignInWithPhone() {
  const t = useTranslations("SignIn");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInWithPhoneFormValues>({
    resolver: zodResolver(signInWithPhoneSchema(t)),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit: SubmitHandler<SignInWithPhoneFormValues> = async (data) => {
    console.log(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

      <div className="sm:col-span-2">
        <SubmitBtn label={"Sign In"} loading={false} />
      </div>
    </form>
  );
}
