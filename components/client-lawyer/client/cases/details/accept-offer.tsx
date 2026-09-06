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
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CaseOffer } from "@/types/client/cases";

export default function AcceptOffer({
  caseId,
  offer,
}: {
  caseId: number;
  offer: CaseOffer;
}) {
  const t = useTranslations("Client.Cases");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-xs font-normal rounded-sm">
          {t("acceptOffer")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("ConfirmHire")}</DialogTitle>
          <DialogDescription className="mt-3">
            {t("ConfirmHireDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-white border-none">
          <Button className="bg-accent text-primary border-secondary hover:bg-accent rounded-sm h-11 flex-1">
            {t("YesHire", { name: offer.lawyer.name })}
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
