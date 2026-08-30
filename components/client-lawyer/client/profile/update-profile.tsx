"use client";

import {
  UpdateProfileFormData,
  updateProfileSchema,
} from "@/types/client/profile";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/providers/user-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import FormInput from "@/components/public/shared/form/form-input";
import FormSelect from "@/components/public/shared/form/form-select";
import { cn } from "@/lib/utils";

export default function UpdateProfile() {
  const { user } = useUser();
  const locale = useLocale();
  const t = useTranslations("Client.Profile");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema(t)),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.city || "",
    },
  });

  const onSubmit: SubmitHandler<UpdateProfileFormData> = async (data) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <form
      className="bg-white border border-secondary rounded-sm p-6 mb-6 space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className={cn("font-semibold", locale === "en" ? "font-lora" : "")}>
        {t("PersonalInfo")}
      </p>

      <FormInput
        required
        errors={errors}
        register={register}
        name="first_name"
        label={t("Fields.FirstName.Label")}
        placeholder={t("Fields.FirstName.Placeholder")}
        inputClassName="bg-background border border-accent/20!"
      />

      <FormInput
        required
        errors={errors}
        register={register}
        name="last_name"
        label={t("Fields.LastName.Label")}
        placeholder={t("Fields.LastName.Placeholder")}
        inputClassName="bg-background border border-accent/20!"
      />

      <FormInput
        required
        errors={errors}
        register={register}
        name="email"
        label={t("Fields.Email.Label")}
        placeholder={t("Fields.Email.Placeholder")}
        inputClassName="bg-background border border-accent/20!"
      />

      <FormInput
        required
        errors={errors}
        register={register}
        name="phone"
        prefix="+971"
        label={t("Fields.Phone.Label")}
        placeholder={t("Fields.Phone.Placeholder")}
        inputClassName="bg-background border border-accent/20!"
      />

      <FormSelect
        name="city"
        label={t("Fields.City.Label")}
        placeholder={t("Fields.City.Placeholder")}
        triggerClassName="bg-background border border-accent/20!"
        control={control}
        required
        options={[
          {
            label: t("Fields.City.Options.Dubai"),
            value: "dubai",
          },
          {
            label: t("Fields.City.Options.AbuDhabi"),
            value: "abu-dhabi",
          },
          {
            label: t("Fields.City.Options.Sharjah"),
            value: "sharjah",
          },
          {
            label: t("Fields.City.Options.Ajman"),
            value: "ajman",
          },
          {
            label: t("Fields.City.Options.UmmAlQuwain"),
            value: "umm-al-quwain",
          },
          {
            label: t("Fields.City.Options.RasAlKhaimah"),
            value: "ras-al-khaimah",
          },
          {
            label: t("Fields.City.Options.Fujairah"),
            value: "fujairah",
          },
        ]}
      />

      {isDirty && (
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-accent rounded-sm font-normal h-11 px-4"
          >
            {isSubmitting && <Spinner className="size-3" />}
            {t("SaveChanges")}
          </Button>
        </div>
      )}
    </form>
  );
}
