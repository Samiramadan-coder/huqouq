"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Plan,
  changePlanSchema,
  ChangePlanFormValues,
} from "@/types/lawyer/emergency-membership";

import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { changePlan } from "@/lib/lawyer/emergency-membership";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ChangePlan({
  notChoosedPlans,
  renewsAt,
}: {
  notChoosedPlans: Plan[];
  renewsAt: string | null;
}) {
  const t = useTranslations("Lawyer.EmergencyMembership");
  const format = useFormatters();
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isValid },
  } = useForm<ChangePlanFormValues>({
    resolver: zodResolver(changePlanSchema(t)),
    mode: "onChange",
    defaultValues: {
      plan: notChoosedPlans[0]?.id,
    },
  });

  function handleOpenChange(next: boolean) {
    if (isSubmitting) return;
    setOpen(next);
    if (!next) reset({ plan: notChoosedPlans[0]?.id });
  }

  async function onSubmit(values: ChangePlanFormValues) {
    const result = await changePlan(values);

    if (result.success) {
      toast.success(result.message ?? t("ChangePlan.success"));
      setOpen(false);
      reset({ plan: notChoosedPlans[0]?.id });
      return;
    }

    if (result.errors?.plan) {
      setError("plan", { message: result.errors.plan });
    }

    toast.error(result.message ?? t("ChangePlan.failed"));
  }

  if (notChoosedPlans.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="rounded-sm border-secondary bg-transparent text-xs font-normal text-primary hover:bg-secondary/30"
        >
          {t("ChangePlan.trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md ring-0! rounded-sm">
        <DialogHeader className="text-start">
          <DialogTitle className="ltr:font-lora text-lg">
            {t("ChangePlan.title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="plan"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <RadioGroup
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  aria-label={t("ChangePlan.title")}
                  className="gap-3"
                >
                  {notChoosedPlans.map((plan) => {
                    const id = `change-plan-${plan.id}`;
                    const selected = field.value === plan.id;

                    return (
                      <label
                        key={plan.id}
                        htmlFor={id}
                        className={cn(
                          "flex h-12 cursor-pointer items-center justify-between rounded-sm border px-4 text-sm text-primary transition-colors",
                          selected
                            ? "border-primary bg-secondary/30"
                            : "border-secondary hover:bg-secondary/20",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <RadioGroupItem
                            id={id}
                            value={plan.id}
                            className="sr-only"
                          />
                          {plan.label}
                        </span>
                        <span className="ltr:font-lora font-bold">
                          {format.money(plan.price)}
                        </span>
                      </label>
                    );
                  })}
                </RadioGroup>

                <FieldError errors={[fieldState.error]} />
              </div>
            )}
          />

          <p className="text-xs leading-relaxed text-primary/45">
            {renewsAt
              ? t("ChangePlan.startsOn", { date: format.date(renewsAt) })
              : t("ChangePlan.startsNextPeriod")}{" "}
            {t("ChangePlan.notChargedToday")}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="h-11 rounded-sm border-secondary font-normal text-primary/60"
              >
                {t("ChangePlan.back")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="h-11 rounded-sm"
            >
              {isSubmitting && <Spinner />}
              {t("ChangePlan.confirm")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
