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
import { CaseOffer } from "@/types/client/cases";
import { Spinner } from "@/components/ui/spinner";
import { declineCaseOffer } from "@/lib/client/cases";

export default function DeclineOffer({
  caseId,
  offer,
}: {
  caseId: number;
  offer: CaseOffer;
}) {
  const t = useTranslations("Client.Cases");
  const [loading, setLoading] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  async function handleDeclineOffer() {
    setLoading(true);
    const result = await declineCaseOffer({ caseId, offerId: offer.id });
    setLoading(false);

    if (result.success) {
      toast.success(t("offerDeclined"));
      closeBtn.current?.click();
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
        <Button className="text-xs font-normal rounded-sm h-9 px-4 bg-destructive hover:bg-destructive/90">
          {t("declineOffer")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("ConfirmDecline")}</DialogTitle>
          <DialogDescription className="mt-3">
            {t("ConfirmDeclineDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={handleDeclineOffer}
            className="bg-destructive text-white border-secondary hover:bg-destructive/90 rounded-sm h-11 flex-1"
          >
            {loading && <Spinner />}
            {t("YesDecline", { name: offer.lawyer.name })}
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
