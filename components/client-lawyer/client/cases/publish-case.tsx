"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
// import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { publishCase } from "@/lib/client/cases";
import { Spinner } from "@/components/ui/spinner";

export default function PublishCase({ caseId }: { caseId: number }) {
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Client.Cases");

  async function handlePublishCase() {
    setLoading(true);
    const result = await publishCase(caseId);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      // router.back();
      return;
    }

    if (result.message) {
      toast.error(result.message);
      return;
    }

    toast.error(t("publishCaseFailed"));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-emerald-700 text-xs hover:bg-transparent hover:text-emerald-700"
        >
          {t("publishCase")}
          <ArrowRight className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("confirmPublish")}</DialogTitle>
          <DialogDescription className="mt-3">
            {t("confirmPublishDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={handlePublishCase}
            className="bg-emerald-700 text-white border-secondary hover:bg-emerald-700/90 rounded-sm h-11 flex-1"
          >
            {loading && <Spinner />}
            {t("yesDoPublish")}
          </Button>
          <DialogClose asChild>
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
