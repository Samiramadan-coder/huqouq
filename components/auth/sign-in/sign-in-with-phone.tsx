"use client";

import {
  signInWithPhoneSchema,
  SignInWithPhoneFormValues,
} from "@/types/sign-in";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { loginWithPhone } from "@/lib/auth";
import { Dialog } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import OtpPhoneDialog from "../shared/otp-phone-dialog";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";

export function SignInWithPhone() {
  const t = useTranslations("SignIn");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInWithPhoneFormValues>({
    resolver: zodResolver(signInWithPhoneSchema(t)),
    defaultValues: {
      phone: "",
    },
  });

  const phone = useWatch({ control, name: "phone" });

  const onSubmit: SubmitHandler<SignInWithPhoneFormValues> = async (data) => {
    const result = await loginWithPhone(data);

    if (result.success) {
      toast.success(result.message);
      setIsOtpDialogOpen(true);
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof SignInWithPhoneFormValues, {
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
          name="phone"
          placeholder={t("fields.phone.placeholder")}
          label={t("fields.phone.label")}
          className="sm:col-span-2"
          register={register}
          required
          errors={errors}
          prefix="+971"
        />

        <SubmitBtn label={t("signIn")} loading={isSubmitting} />
      </form>

      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <OtpPhoneDialog phone={phone} />
      </Dialog>
    </>
  );
}
