"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  updateCardSchema,
  UpdateCardFormValues,
} from "@/types/lawyer/emergency-membership";

import { toast } from "sonner";
import { useState } from "react";
import { Lock } from "lucide-react";
import CardFields from "./card-fields";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Path } from "react-hook-form";
import { updateCard } from "@/lib/lawyer/emergency-membership";

const defaultValues: UpdateCardFormValues = {
  card: { name: "", number: "", exp: "", cvc: "" },
};

export default function UpdateCard() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Lawyer.EmergencyMembership");

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<UpdateCardFormValues>({
    resolver: zodResolver(updateCardSchema(t)),
    defaultValues,
  });

  function handleOpenChange(next: boolean) {
    if (isSubmitting) return;
    setOpen(next);
    if (!next) reset(defaultValues);
  }

  async function onSubmit(values: UpdateCardFormValues) {
    const result = await updateCard(values);

    if (result.success) {
      toast.success(result.message ?? t("UpdateCard.success"));
      setOpen(false);
      reset(defaultValues);
      return;
    }

    if (result.errors) {
      for (const [field, message] of Object.entries(result.errors)) {
        setError(field as Path<UpdateCardFormValues>, { message });
      }
    }

    toast.error(result.message ?? t("UpdateCard.failed"));
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="rounded-sm border-secondary bg-transparent text-xs font-normal text-primary hover:bg-secondary/30"
        >
          {t("UpdateCard.trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md ring-0! rounded-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-start">
          <DialogTitle className="ltr:font-lora text-lg">
            {t("UpdateCard.title")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <CardFields control={control} disabled={isSubmitting} />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-sm"
          >
            {isSubmitting ? (
              <Spinner />
            ) : (
              <Lock className="size-4" aria-hidden="true" />
            )}
            {t("UpdateCard.save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
