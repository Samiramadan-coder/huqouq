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
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { markCaseAsComplete } from "@/lib/client/messages";

export default function MarkAsComplete({ caseId }: { caseId: number }) {
  const t = useTranslations("Client.Cases");
  const [loading, setLoading] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  async function handleMarkAsComplete() {
    setLoading(true);
    const result = await markCaseAsComplete(caseId);

    if (result.success) {
      toast.success(result.message);
      setLoading(false);
      closeBtn.current?.click();
      router.refresh();
      return;
    }

    if (result.message) {
      toast.error(result.message);
      setLoading(false);
      return;
    }

    toast.error(t("markAsCompleteFailed"));
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="rounded-sm border-secondary bg-white text-[11px] font-medium text-accent"
        >
          {t("markAsComplete")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("markAsComplete")}</DialogTitle>
          <DialogDescription className="mt-3">
            {t("markAsCompleteDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={handleMarkAsComplete}
            disabled={loading}
            className="bg-emerald-700 text-white border-secondary hover:bg-emerald-700/90 rounded-sm h-11 flex-1"
          >
            {loading && <Spinner />}
            {t("markAsComplete")}
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
