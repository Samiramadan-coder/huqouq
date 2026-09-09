"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CaseOffer } from "@/types/client/cases";
import { Spinner } from "@/components/ui/spinner";
import { acceptCaseOffer } from "@/lib/client/cases";
import { cn } from "cn";

export default function AcceptOffer({
  caseId,
  offer,
  btnClassName,
}: {
  caseId: number;
  offer: CaseOffer;
  btnClassName?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Client.Cases");
  const [loading, setLoading] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const fontClass = locale === "en" ? "font-lora" : "";

  async function handleAcceptOffer() {
    setLoading(true);
    const result = await acceptCaseOffer({ caseId, offerId: offer.id });
    setLoading(false);

    if (result.success) {
      toast.success(t("offerAccepted"));
      closeBtn.current?.click();
      return;
    }

    if (result.message) {
      toast.error(result.message);
      return;
    }

    toast.error(t("offerAcceptFailed"));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "text-xs font-semibold rounded-sm h-9 px-4",
            btnClassName,
          )}
        >
          {t("acceptOffer")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm ring-0!">
        <DialogHeader>
          <DialogTitle className={cn("font-bold", fontClass)}>
            {t("ConfirmHire")}
          </DialogTitle>
          <DialogDescription className="mt-3">
            {t("ConfirmHireDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={handleAcceptOffer}
            className="bg-accent text-primary border-secondary hover:bg-accent rounded-sm h-11 flex-1"
          >
            {loading && <Spinner />}
            {t("YesHire", { name: offer.lawyer.name })}
          </Button>
          <DialogClose asChild>
            <Button
              ref={closeBtn}
              variant="outline"
              className="bg-transparent border-secondary rounded-sm h-11 flex-1"
            >
              {t("Cancel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
