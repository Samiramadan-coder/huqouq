"use client";

import {
  AccountField,
  AccountFieldFormData,
  accountFieldSchemas,
} from "@/types/client/settings";

import { toast } from "sonner";
import { useState } from "react";
import AreaButton from "./area-button";
import { useTranslations } from "next-intl";
import { useUser } from "@/providers/user-provider";
import { updateProfile } from "@/lib/client/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import FormInput from "@/components/public/shared/form/form-input";

export default function NormalElementControl({
  type,
  field,
  label,
  subtitle,
}: {
  type: "text" | "email" | "tel";
  field: AccountField;
  label: string;
  subtitle?: string;
}) {
  const t = useTranslations("Client.Settings");
  const { user, setUser } = useUser();
  const [mode, setMode] = useState<"normal" | "edit">("normal");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountFieldFormData>({
    resolver: zodResolver(
      accountFieldSchemas(t)[field],
    ) as Resolver<AccountFieldFormData>,
    defaultValues: { [field]: user?.[field] ?? "" },
  });

  if (!user) {
    return null;
  }

  const startEditing = () => {
    reset({ [field]: user[field] ?? "" });
    setMode("edit");
  };

  const onSubmit: SubmitHandler<AccountFieldFormData> = async (data) => {
    try {
      const result = await updateProfile(data);
      if (!result.success) {
        toast.error(t("updateFailed"));
        return;
      }

      setUser(result.user);
      toast.success(result.message);
      setMode("normal");
    } catch (error) {
      console.error("Error Updating Profile", error);
      toast.error(t("updateFailed"));
    }
  };

  return (
    <div className="py-4 flex items-center justify-between gap-4">
      <div>
        <span className="text-sm text-primary">{label}</span>
        {subtitle && (
          <p className="text-[11px] text-primary/40 mt-0.5 leading-snug">
            {subtitle}
          </p>
        )}
      </div>

      {mode === "normal" && (
        <div className="flex items-center gap-2">
          <span className="text-primary/60 truncate text-sm">
            {user[field]}
          </span>
          <AreaButton label={t("edit")} type="button" onClick={startEditing} />
        </div>
      )}

      {mode === "edit" && (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex items-start gap-3"
        >
          <FormInput
            name={field}
            type={type}
            register={register}
            errors={errors}
            className="flex-1"
            ariaLabel={label}
            inputClassName="text-xs!"
            {...(field === "email" && { autoComplete: "email" as const })}
            {...(field === "phone" && {
              prefix: "+971",
              dir: "ltr" as const,
              inputMode: "numeric" as const,
              autoComplete: "tel-national" as const,
            })}
          />

          <div className="flex items-center gap-3 h-11">
            <AreaButton
              label={t("cancel")}
              type="button"
              className="text-primary/60"
              onClick={() => setMode("normal")}
            />
            <AreaButton
              disabled={isSubmitting}
              label={t("save")}
              type="submit"
            />
          </div>
        </form>
      )}
    </div>
  );
}
