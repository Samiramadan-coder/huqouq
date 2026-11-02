import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";

import BlockReasons from "./block-reasons";
import { Lock, XIcon } from "lucide-react";
import ConfirmDialog from "./confirm-dialog";
import { getTranslations } from "next-intl/server";
import { ClientDangerZone } from "@/types/client/settings";
import { LawyerDangerZone } from "@/types/lawyer/settings";

type Props =
  | { type: "client"; data: ClientDangerZone }
  | { type: "lawyer"; data: LawyerDangerZone };

export default async function DangerZone(props: Props) {
  const t = await getTranslations("Client.Settings.DangerZone");

  const isBlocked = !props.data.can_delete;

  return (
    <div>
      <h2 className="ltr:font-lora text-[15px] text-primary tracking-wide mb-4">
        {t("title")}
      </h2>

      <div className="bg-white px-5 py-4 border border-secondary border-s-2 border-s-destructive/40 rounded-[5px] flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-primary">{t("deleteAccount")}</p>
          <p className="text-[11px] text-primary/40 mt-0.5 leading-snug">
            {isBlocked ? t("Blocked.hint") : t("deleteAccountHint")}
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="text-xs text-destructive/80 hover:text-destructive cursor-pointer shrink-0 transition-colors inline-flex items-center gap-1.5"
            >
              {isBlocked && <Lock className="size-3" />}
              {t("deleteAccount")}
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent
            className={`sm:max-w-md! p-7 rounded-sm ring-0! border-t-4 gap-5 ${
              isBlocked ? "border-t-amber-500/80" : "border-t-destructive/80"
            }`}
          >
            <AlertDialogCancel
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 inset-e-3 text-primary/40 hover:text-primary hover:bg-transparent"
            >
              <XIcon />
              <span className="sr-only">{t("Dialog.cancel")}</span>
            </AlertDialogCancel>

            {isBlocked ? (
              props.type === "client" ? (
                <BlockReasons type="client" blockers={props.data.blockers} />
              ) : (
                <BlockReasons type="lawyer" blockers={props.data.blockers} />
              )
            ) : (
              <ConfirmDialog reasons={props.data.reasons} />
            )}
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
