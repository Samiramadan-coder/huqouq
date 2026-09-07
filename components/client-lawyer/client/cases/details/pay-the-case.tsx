"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { payCase } from "@/lib/client/cases";
import { MoveRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function PayTheCase({
  caseId,
  platformFee,
}: {
  caseId: number;
  platformFee: number;
}) {
  const t = useTranslations("Client.Cases");
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = useState(false);

  async function completePayment() {
    setLoading(true);
    const result = await payCase(caseId);
    setLoading(false);

    if (result.success) {
      toast.success(t("paymentSuccess"));
      return;
    }

    if (result.message) {
      toast.error(result.message);
      return;
    }

    toast.error(t("paymentFailed"));
  }

  return (
    <Button
      onClick={completePayment}
      className="mt-4 w-full h-11 text-primary bg-accent hover:bg-accent hover:text-primary"
      disabled={loading}
    >
      {loading && <Spinner className="size-4" />}
      {t("payNow")} ({tCommon("AED")} {platformFee})
      <MoveRight className="size-4 rtl:rotate-180" />
    </Button>
  );
}
