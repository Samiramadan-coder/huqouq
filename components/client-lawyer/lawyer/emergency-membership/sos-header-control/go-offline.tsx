import { toast } from "sonner";
import { ZapOff } from "lucide-react";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DialogClose } from "@/components/ui/dialog";
import { DialogIconHeader } from "./dialog-icon-header";
import { updateAvailability } from "@/lib/lawyer/emergency-membership";

export function GoOffline({
  liveUntil,
  onDone,
}: {
  liveUntil: string | null;
  onDone: () => void;
}) {
  const t = useTranslations("Lawyer.EmergencyLive");
  const format = useFormatters();
  const [pending, startTransition] = useTransition();

  function onGoOffline() {
    startTransition(async () => {
      const result = await updateAvailability({ is_live: false });

      if (result.success) {
        toast.success(result.message ?? t("offlineSuccess"));
        onDone();
        return;
      }

      toast.error(result.message ?? t("failed"));
    });
  }

  const until = liveUntil ? new Date(liveUntil) : null;
  const untilLabel =
    until && !Number.isNaN(until.getTime())
      ? format.digits(
          until.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        )
      : null;

  return (
    <>
      <DialogIconHeader
        icon={<ZapOff className="size-5" aria-hidden="true" />}
        iconClassName="bg-secondary/50 text-primary/60"
        title={t("GoOffline.title")}
      />

      <p className="text-sm leading-relaxed text-primary/55">
        {t("GoOffline.description")}
        {untilLabel && <> {t("GoOffline.liveUntil", { time: untilLabel })}</>}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            className="h-11 rounded-sm border-secondary font-normal text-primary/60"
          >
            {t("GoOffline.stayLive")}
          </Button>
        </DialogClose>
        <Button
          type="button"
          onClick={onGoOffline}
          disabled={pending}
          className="h-11 rounded-sm bg-destructive text-white hover:bg-destructive/90"
        >
          {pending && <Spinner />}
          {t("GoOffline.submit")}
        </Button>
      </div>
    </>
  );
}
