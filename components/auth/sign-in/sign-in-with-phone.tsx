"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import FormInput from "@/components/shared/form/form-input";
import SubmitBtn from "@/components/shared/form/submit-btn";
import { SignUpFormValues, signUpSchema } from "@/types/sign-up";

export function SignInWithPhone() {
  const t = useTranslations("SignUp");

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
