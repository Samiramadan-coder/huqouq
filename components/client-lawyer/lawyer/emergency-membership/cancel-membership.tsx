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
import { useState, useTransition } from "react";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cancelMembership } from "@/lib/lawyer/emergency-membership";

export function CancelMembership() {
  const t = useTranslations("Lawyer.EmergencyMembership");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      const result = await cancelMembership();

      if (result.success) {
        toast.success(result.message ?? t("Cancel.success"));
        setOpen(false);
        return;
      }

      toast.error(result.message ?? t("Cancel.failed"));
    });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="rounded-sm border-destructive/30 bg-transparent text-xs font-normal text-destructive hover:bg-destructive/5 hover:text-destructive"
        >
          {t("cancelMembership")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md ring-0! rounded-sm">
        <DialogHeader className="flex-row items-start gap-3 text-start">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="size-5" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <DialogTitle>{t("Cancel.title")}</DialogTitle>
            <DialogDescription>{t("Cancel.description")}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-1">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="h-11 w-full rounded-sm bg-destructive text-white hover:bg-destructive/90"
          >
            {pending && <Spinner />}
            {t("Cancel.confirm")}
          </Button>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              className="h-11 w-full text-xs text-primary/50"
            >
              {t("Cancel.keep")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
