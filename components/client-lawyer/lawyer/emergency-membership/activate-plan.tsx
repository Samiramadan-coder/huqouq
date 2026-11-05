"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Plan } from "@/types/lawyer/emergency-membership";
import { activatePlan } from "@/lib/lawyer/emergency-membership";

export default function ActivatePlan({
  plan,
  isCurrent,
  isFree,
}: {
  plan: Plan;
  isCurrent: boolean;
  isFree: boolean;
}) {
  const t = useTranslations("Lawyer.EmergencyMembership");
  const format = useFormatters();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      const result = await activatePlan(plan.id);

      if (result.success) {
        toast.success(result.message ?? t("Activate.success"));
        setOpen(false);
        return;
      }

      toast.error(result.message ?? t("Activate.failed"));
    });
  }

  if (isCurrent) {
    return (
      <Button
        type="button"
        disabled
        className="mt-5 h-10 w-full rounded-sm bg-secondary/50 text-primary/40 disabled:opacity-100 hover:bg-secondary/50"
      >
        {t("currentPlan")}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button type="button" className="mt-5 h-10 w-full rounded-sm">
          {isFree ? t("activateFree") : t("activate")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md ring-0! rounded-sm">
        <DialogHeader className="flex-row items-start gap-3 text-start">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <DialogTitle>
              {t("Activate.title", { plan: plan.label })}
            </DialogTitle>
            <DialogDescription>{t("Activate.description")}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-between rounded-sm border border-secondary bg-background px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/45">
              {plan.label}
            </p>
            <p
              className={cn(
                "ltr:font-lora text-xl font-bold text-primary",
                isFree && "text-base text-primary/40 line-through",
              )}
            >
              {format.money(plan.price)}
            </p>
          </div>

          {isFree && (
            <span className="inline-flex items-center rounded-sm border border-green-200 bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
              {t("freeDuringLaunch")}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="h-11 w-full rounded-sm"
          >
            {pending && <Spinner />}
            {t("Activate.confirm")}
          </Button>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              className="h-11 w-full text-xs text-primary/50"
            >
              {t("Activate.cancel")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
