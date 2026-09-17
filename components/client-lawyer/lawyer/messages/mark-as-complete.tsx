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
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { markCaseAsComplete } from "@/lib/lawyer/messages";
import { toast } from "sonner";

export default function MarkAsComplete({ caseId }: { caseId: number }) {
  const t = useTranslations("Lawyer.Messages");
  const [loading, setLoading] = useState(false);

  async function handleMarkAsComplete() {
    setLoading(true);
    const result = await markCaseAsComplete(caseId);

    if (result.success) {
      toast.success(result.message);
      setLoading(false);
      return;
    }

    if (result.message) {
      toast.error(result.message);
      setLoading(false);
      return;
    }

    toast.error(t("MarkAsCompleteFailed"));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="rounded-sm border-secondary bg-white text-[11px] font-medium text-accent"
        >
          {t("MarkAsComplete")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("MarkAsComplete")}</DialogTitle>
          <DialogDescription className="mt-3">
            {t("MarkAsCompleteDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={handleMarkAsComplete}
            className="bg-emerald-700 text-white border-secondary hover:bg-emerald-700/90 rounded-sm h-11 flex-1"
          >
            {loading && <Spinner />}
            {t("MarkAsComplete")}
          </Button>
          <DialogClose asChild>
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
