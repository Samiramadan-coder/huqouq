import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { DialogIconHeader } from "./dialog-icon-header";

// The API needs the lawyer's office emirate (set in the profile) to go live
export function OfficeEmirateRequired({ onClose }: { onClose: () => void }) {
  const t = useTranslations("Lawyer.EmergencyLive");

  return (
    <>
      <DialogIconHeader
        icon={<MapPin className="size-5" aria-hidden="true" />}
        iconClassName="bg-accent/10 text-accent"
        title={t("OfficeEmirate.title")}
      />

      <p className="text-sm leading-relaxed text-primary/55">
        {t("OfficeEmirate.description")}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-sm border-secondary font-normal text-primary/60"
          >
            {t("notNow")}
          </Button>
        </DialogClose>
        <Button asChild className="h-11 rounded-sm">
          <Link href="/lawyer/profile" onClick={onClose}>
            {t("OfficeEmirate.goToProfile")}
          </Link>
        </Button>
      </div>
    </>
  );
}
