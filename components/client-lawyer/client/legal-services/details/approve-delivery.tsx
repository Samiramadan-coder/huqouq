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
import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { approveDelivery } from "@/lib/client/legal-services";

export default function ApproveDelivery({ serviceId }: { serviceId: number }) {
  const t = useTranslations("Client.LegalServices");
  const [loading, setLoading] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  async function handleApproveDelivery() {
    setLoading(true);
    const result = await approveDelivery(serviceId);

    if (result.success) {
      toast.success(result.message);
      closeBtn.current?.click();
      setLoading(false);
      return;
    }

    if (result.message) {
      toast.error(result.message);
      setLoading(false);
      return;
    }

    toast.error(t("approveDeliveryFailed"));
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-10.5 inline-flex items-center gap-2 bg-emerald-600 text-white font-sans text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-emerald-700 hover:text-white transition-colors duration-200"
        >
          <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
          {t("approve")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm ring-0! rounded-sm">
        <DialogHeader>
          <DialogTitle>{t("approve")}</DialogTitle>
          <DialogDescription className="mt-3">
            {t("approveDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={handleApproveDelivery}
            className="bg-emerald-600 text-white border-secondary hover:bg-emerald-700 rounded-sm h-11 flex-1"
          >
            {loading && <Spinner />}
            {t("approve")}
          </Button>
          <DialogClose asChild ref={closeBtn}>
            <Button
              variant="outline"
              className="bg-transparent border-secondary rounded-sm h-11 flex-1"
            >
              {t("cancel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
