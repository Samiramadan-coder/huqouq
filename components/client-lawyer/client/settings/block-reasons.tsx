import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Briefcase,
  CalendarClock,
  CircleAlert,
  Lock,
  LucideIcon,
  Scale,
  Wallet,
} from "lucide-react";

import { getTranslations } from "next-intl/server";
import { ClientDangerZone } from "@/types/client/settings";
import { LawyerDangerZone } from "@/types/lawyer/settings";

type BlockerCode =
  | ClientDangerZone["blockers"][number]["code"]
  | LawyerDangerZone["blockers"][number]["code"];

const BLOCKER_ICONS: Record<BlockerCode, LucideIcon> = {
  hired_case: Briefcase,
  assigned_case: Briefcase,
  active_legal_service: Scale,
  upcoming_consultation: CalendarClock,
  unpaid_earnings: Wallet,
};

type Props =
  | { type: "client"; blockers: ClientDangerZone["blockers"] }
  | { type: "lawyer"; blockers: LawyerDangerZone["blockers"] };

export default async function BlockReasons(props: Props) {
  const t = await getTranslations("Client.Settings.DangerZone");

  return (
    <>
      <AlertDialogHeader className="flex! flex-row items-center gap-3 text-start">
        <AlertDialogMedia className="mb-0 size-9 shrink-0 rounded-full bg-amber-500/10">
          <Lock className="size-4! text-amber-600" />
        </AlertDialogMedia>
        <AlertDialogTitle className="font-normal text-lg text-primary ltr:font-lora">
          {t("Blocked.title")}
        </AlertDialogTitle>
      </AlertDialogHeader>

      <div className="space-y-4">
        <AlertDialogDescription className="text-sm text-primary/60 leading-relaxed text-start">
          {t("Blocked.description")}
        </AlertDialogDescription>

        <ul className="space-y-2">
          {props.blockers.map((blocker) => {
            const Icon = BLOCKER_ICONS[blocker.code] ?? CircleAlert;

            return (
              <li
                key={blocker.code}
                className="flex items-center gap-3 rounded-sm border border-secondary bg-secondary/20 px-3 py-2.5"
              >
                <span className="size-8 shrink-0 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Icon className="size-4 text-amber-600" />
                </span>
                <span className="flex-1 text-sm text-primary/80">
                  {blocker.label}
                </span>
                <span className="min-w-6 h-6 px-2 rounded-full bg-amber-500/10 text-amber-700 text-xs font-medium flex items-center justify-center tabular-nums">
                  {blocker.count}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="text-xs text-primary/40 leading-relaxed">
          {t("Blocked.footer")}
        </p>
      </div>

      <AlertDialogFooter className="m-0 p-0 pt-1 border-none bg-transparent">
        <AlertDialogCancel className="h-10 w-full rounded-sm border-secondary bg-transparent font-normal text-primary/70 hover:bg-transparent hover:text-primary">
          {t("Blocked.gotIt")}
        </AlertDialogCancel>
      </AlertDialogFooter>
    </>
  );
}
