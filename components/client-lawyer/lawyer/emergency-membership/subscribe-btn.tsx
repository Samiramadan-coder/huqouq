"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Plan,
  subscribeSchema,
  SubscribeFormValues,
} from "@/types/lawyer/emergency-membership";

import { toast } from "sonner";
import { useState } from "react";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Path } from "react-hook-form";
import { subscribePlan } from "@/lib/lawyer/emergency-membership";
import CardFields from "./card-fields";

const defaultValues: SubscribeFormValues = {
  card: { name: "", number: "", exp: "", cvc: "" },
  auto_renew: true,
};

export default function SubscribeButton({ plan }: { plan: Plan }) {
  const format = useFormatters();
  const [open, setOpen] = useState(false);
  const t = useTranslations("Lawyer.EmergencyMembership");

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeSchema(t)),
    defaultValues,
  });

  // The new period starts today and runs for the plan's length
  const start = new Date();
  const end = new Date(start);
  end.setMonth(end.getMonth() + plan.months);
  end.setDate(end.getDate() - 1);

  const price = format.money(plan.price);

  function handleOpenChange(next: boolean) {
    if (isSubmitting) return;
    setOpen(next);
    if (!next) reset(defaultValues);
  }

  async function onSubmit(values: SubscribeFormValues) {
    const result = await subscribePlan(plan.id, values);

    if (result.success) {
      toast.success(result.message ?? t("Subscribe.success"));
      setOpen(false);
      reset(defaultValues);
      return;
    }

    if (result.errors) {
      for (const [field, message] of Object.entries(result.errors)) {
        setError(field as Path<SubscribeFormValues>, { message });
      }
    }

    toast.error(result.message ?? t("Subscribe.failed"));
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" className="mt-5 h-10 w-full rounded-sm">
          {t("activate")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md ring-0! rounded-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-start">
          <DialogTitle className="ltr:font-lora text-lg">
            {t("Subscribe.title")}
          </DialogTitle>
        </DialogHeader>

        <dl className="space-y-2 rounded-sm border border-secondary bg-background p-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-primary/55">{t("Subscribe.plan")}</dt>
            <dd className="text-primary">{plan.label}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-primary/55">{t("Subscribe.period")}</dt>
            <dd className="text-primary">
              {format.date(start)} – {format.date(end)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-secondary pt-2">
            <dt className="font-semibold text-primary">
              {t("Subscribe.total")}
            </dt>
            <dd className="ltr:font-lora font-bold text-primary">{price}</dd>
          </div>
        </dl>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <CardFields control={control} disabled={isSubmitting} />

          <Controller
            control={control}
            name="auto_renew"
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Checkbox
                  id="subscribe-auto-renew"
                  checked={field.value}
                  disabled={isSubmitting}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  className="size-4 rounded-[3px] border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label
                  htmlFor="subscribe-auto-renew"
                  className="cursor-pointer text-sm font-normal text-primary/60"
                >
                  {t("Subscribe.autoRenew")}
                </Label>
              </div>
            )}
          />

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
            {t("Subscribe.pay", { price })}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
