"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";

import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from "@/types/client/settings";

import { useState } from "react";
import AreaButton from "./area-button";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/public/shared/form/form-input";
import { Spinner } from "@/components/ui/spinner";

export default function ChangingPassword() {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema(t)),
  });

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="py-4 flex items-center justify-between gap-4">
        <span className="text-sm text-primary">Password</span>
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm text-primary/60 truncate">
            ***********
          </span>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <AreaButton
                label="Change Password"
                type="button"
                onClick={() => setOpen(true)}
              />
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm ring-0! rounded-sm">
              <DialogHeader>
                <DialogTitle className="font-normal ltr:font-lora">
                  Change Password
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormInput
                    register={register}
                    name="current_password"
                    required
                    errors={errors}
                    label="Current Password"
                    labelClassName="text-primary/60 text-xs font-normal"
                    inputClassName="border border-secondary"
                    type="password"
                  />

                  <FormInput
                    register={register}
                    name="new_password"
                    required
                    errors={errors}
                    label="New Password"
                    labelClassName="text-primary/60 text-xs font-normal"
                    inputClassName="border border-secondary"
                    type="password"
                  />

                  <FormInput
                    register={register}
                    name="new_password_confirmation"
                    required
                    errors={errors}
                    label="New Password Confirmation"
                    labelClassName="text-primary/60 text-xs font-normal"
                    inputClassName="border border-secondary"
                    type="password"
                  />
                </div>

                <div className="flex items-center gap-4 justify-end">
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      className="text-primary/60 hover:text-primary hover:bg-transparent font-normal"
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button type="submit" variant="default">
                    {!isSubmitting && <Spinner />}
                    Save
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
