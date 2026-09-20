"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { T } from "@/types/shared";
import { useTranslations } from "next-intl";
import FormInput from "../shared/form/form-input";
import FormTextarea from "../shared/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const schema = (t: T) =>
  z.object({
    name: z.string().min(1, t("name.required")),
    email: z.email(t("email.invalid")),
    subject: z.string().min(1, t("subject.required")),
    message: z.string().min(1, t("message.required")),
  });

type FormData = z.infer<ReturnType<typeof schema>>;

export default function Form() {
  const t = useTranslations("Contact.form");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema(t)),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        register={register}
        name="name"
        inputClassName="border border-secondary h-12.5"
        label={t("name.label")}
        placeholder={t("name.placeholder")}
        required
        errors={errors}
        labelClassName="text-primary"
      />

      <FormInput
        register={register}
        name="email"
        inputClassName="border border-secondary h-12.5"
        label={t("email.label")}
        placeholder={t("email.placeholder")}
        required
        errors={errors}
        labelClassName="text-primary"
      />

      <FormInput
        register={register}
        name="subject"
        inputClassName="border border-secondary h-12.5"
        label={t("subject.label")}
        placeholder={t("subject.placeholder")}
        required
        errors={errors}
        labelClassName="text-primary"
      />

      <FormTextarea
        register={register}
        name="message"
        textareaClassName="border border-secondary"
        label={t("message.label")}
        placeholder={t("message.placeholder")}
        required
        errors={errors}
        labelClassName="text-primary"
      />

      <Button
        type="submit"
        className="w-full text-base h-12.5 bg-accent rounded-sm font-semibold hover:bg-accent/90"
      >
        {isSubmitting && <Spinner />}
        {t("submit")}
      </Button>
    </form>
  );
}
