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
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { declineOffer } from "@/lib/lawyer/browse-cases";

export default function DeclineOffer({ caseId }: { caseId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Lawyer.BrowseCases");

  async function handleDeclineOffer() {
    setLoading(true);
    const result = await declineOffer(caseId);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      router.back();
      return;
    }

    if (result.message) {
      toast.error(result.message);
      return;
    }

    toast.error(t("offerDeclineFailed"));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="font-normal rounded-sm h-10 px-4 bg-destructive hover:bg-destructive/90"
        >
          {t("declineOffer")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("confirmDecline")}</DialogTitle>
          <DialogDescription className="mt-3">
            {t("confirmDeclineDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={handleDeclineOffer}
            className="bg-destructive text-white border-secondary hover:bg-destructive/90 rounded-sm h-11 flex-1"
          >
            {loading && <Spinner />}
            {t("yesDecline")}
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
