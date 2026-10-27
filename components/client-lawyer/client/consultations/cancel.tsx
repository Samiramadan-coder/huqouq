"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cancelConsultation } from "@/lib/client/consultations";
import { useFormatters } from "@/lib/format";
import { Consultation } from "@/types/client/consultation";

export default function Cancel({
  consultationId,
  cancellation,
  currency,
}: {
  consultationId: number;
  cancellation: Consultation["cancellation"];
  currency: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Client.Consultations.Details");
  const format = useFormatters();

  async function handleCancel() {
    setLoading(true);

    let result: Awaited<ReturnType<typeof cancelConsultation>>;

    try {
      result = await cancelConsultation(consultationId);
    } catch {
      toast.error(t("cancelFailed"));
      setLoading(false);
      return;
    }

    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      return;
    }

    toast.error(result.message ?? t("cancelFailed"));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-sm border-destructive/20 bg-transparent text-destructive font-normal hover:bg-destructive/5 hover:text-destructive"
        >
          {t("cancelConsultation")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm ring-0! rounded-sm">
        <DialogHeader>
          <DialogTitle>{t("cancelConsultation")}</DialogTitle>
          <DialogDescription className="mt-3">
            {t("cancelDescription")}
          </DialogDescription>
        </DialogHeader>

        {cancellation.refundable ? (
          <p className="text-sm text-primary">
            {t("fullRefund", {
              amount: format.money(cancellation.refund_amount, currency),
            })}
          </p>
        ) : (
          <p className="text-sm font-medium text-destructive">
            {t("notRefundable")}
          </p>
        )}

        {cancellation.policy && (
          <p className="text-xs text-primary/45">{cancellation.policy}</p>
        )}

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={handleCancel}
            disabled={loading}
            className="bg-destructive text-white border-secondary hover:bg-destructive/20 hover:text-destructive rounded-sm h-11 flex-1"
          >
            {loading && <Spinner />}
            {t("cancelConsultation")}
          </Button>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={loading}
              className="bg-transparent border-secondary rounded-sm h-11 flex-1"
            >
              {t("keepIt")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
