import { Link } from "@/i18n/navigation";
import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { DialogIconHeader } from "./dialog-icon-header";
import { EmergencyLive } from "@/types/lawyer/emergency-membership";
import SaveArea from "./save-area";

export function MembershipRequired({
  message,
  onClose,
  reason,
}: {
  message: string;
  onClose: () => void;
  reason: EmergencyLive["reason"];
}) {
  const t = useTranslations("Lawyer.EmergencyLive");

  return (
    <>
      <DialogIconHeader
        icon={<ShieldAlert className="size-5" aria-hidden="true" />}
        iconClassName="bg-accent/10 text-accent"
        title={t("Required.title")}
      />

      <p className="text-sm leading-relaxed text-primary/55">
        {message || t("Required.description")}
      </p>

      {reason === "not_approved" && (
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
            <Link href="/lawyer/emergency-membership" onClick={onClose}>
              {t("Required.viewMembership")}
            </Link>
          </Button>
        </div>
      )}

      {reason === "needs_area" && <SaveArea />}
    </>
  );
}
