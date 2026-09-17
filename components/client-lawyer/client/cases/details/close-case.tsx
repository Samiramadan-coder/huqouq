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
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { closeCase } from "@/lib/client/cases";

export default function CloseCase({ caseId }: { caseId: number }) {
  const t = useTranslations("Client.Cases");
  const [loading, setLoading] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  async function handleCloseCase() {
    setLoading(true);
    const result = await closeCase(caseId);

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

    toast.error(t("closeCaseFailed"));
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-sm border-destructive/5 font-normal text-xs text-destructive/80 hover:bg-transparent hover:text-destructive hover:border-destructive/20"
        >
          {t("closeCase")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("closeCase")}</DialogTitle>
          <DialogDescription className="mt-3">
            {t("closeCaseDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={handleCloseCase}
            className="bg-destructive text-white border-secondary hover:bg-destructive/20 hover:text-destructive rounded-sm h-11 flex-1"
          >
            {loading && <Spinner />}
            {t("closeCase")}
          </Button>
          <DialogClose asChild ref={closeBtn}>
            <Button
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
