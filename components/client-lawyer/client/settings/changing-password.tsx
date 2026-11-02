"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";

import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from "@/types/client/settings";

import { useState } from "react";
import AreaButton from "./area-button";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import FormInput from "@/components/public/shared/form/form-input";
import { changePassword } from "@/lib/client/settings";
import { toast } from "sonner";

const labelClassName = "text-primary/60 text-xs font-normal";
const inputClassName = "border border-secondary";

export default function ChangingPassword() {
  const t = useTranslations("Client.Settings");
  const [open, setOpen] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema(t)),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  // Clear typed passwords and errors whenever the dialog closes
  const handleOpenChange = (value: boolean) => {
    if (isSubmitting) return;
    setOpen(value);
    if (!value) reset();
  };

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    try {
      const result = await changePassword(data);

      if (result.success) {
        toast.success(result.message);
        return setOpen(false);
      }

      toast.error("");
    } catch (error) {
      toast.error("");
    }
  };

  return (
    <div className="py-4 flex items-center justify-between gap-4">
      <span className="text-sm text-primary">{t("Password.label")}</span>

      <div className="flex items-center gap-2">
        <span className="text-sm text-primary/60 truncate" aria-hidden>
          ***********
        </span>

        <AreaButton
          label={t("Password.change")}
          type="button"
          onClick={() => setOpen(true)}
        />

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-sm ring-0! rounded-sm">
            <DialogHeader>
              <DialogTitle className="font-normal ltr:font-lora">
                {t("Password.change")}
              </DialogTitle>
            </DialogHeader>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormInput
                  register={register}
                  name="current_password"
                  required
                  errors={errors}
                  label={t("Password.currentPassword")}
                  labelClassName={labelClassName}
                  inputClassName={inputClassName}
                  type="password"
                  autoComplete="current-password"
                />

                <FormInput
                  register={register}
                  name="password"
                  required
                  errors={errors}
                  label={t("Password.newPassword")}
                  labelClassName={labelClassName}
                  inputClassName={inputClassName}
                  type="password"
                  autoComplete="new-password"
                />

                <FormInput
                  register={register}
                  name="password_confirmation"
                  required
                  errors={errors}
                  label={t("Password.confirmPassword")}
                  labelClassName={labelClassName}
                  inputClassName={inputClassName}
                  type="password"
                  autoComplete="new-password"
                />
              </div>

              <div className="flex items-center gap-4 justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isSubmitting}
                    className="text-primary/60 hover:text-primary hover:bg-transparent font-normal"
                  >
                    {t("cancel")}
                  </Button>
                </DialogClose>

                <Button type="submit" variant="default" disabled={isSubmitting}>
                  {isSubmitting && <Spinner />}
                  {t("save")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
