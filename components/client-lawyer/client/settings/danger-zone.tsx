"use client";

import {
  AlertDialog,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { useTranslations } from "next-intl";
import { CircleAlert, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const REMOVED_ITEMS = [
  "profile",
  "cases",
  "consultations",
  "messages",
  "documents",
] as const;

export default function DangerZone() {
  const t = useTranslations("Client.Settings.DangerZone");

  return (
    <div>
      <h2 className="ltr:font-lora text-[15px] text-primary tracking-wide mb-4">
        {t("title")}
      </h2>

      <div className="bg-white px-5 py-4 border border-secondary border-s-2 border-s-destructive/40 rounded-[5px] flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-primary">{t("deleteAccount")}</p>
          <p className="text-[11px] text-primary/40 mt-0.5 leading-snug">
            {t("deleteAccountHint")}
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="text-xs text-destructive/80 hover:text-destructive cursor-pointer shrink-0 transition-colors"
            >
              {t("deleteAccount")}
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="sm:max-w-md! p-7 rounded-sm ring-0! border-t-4 border-t-destructive/80 gap-5">
            <AlertDialogCancel
              variant="ghost"
              size="icon-sm"
              className="absolute top-3 inset-e-3 text-primary/40 hover:text-primary hover:bg-transparent"
            >
              <XIcon />
              <span className="sr-only">{t("Dialog.cancel")}</span>
            </AlertDialogCancel>

            <AlertDialogHeader className="flex! flex-row items-center gap-3 text-start">
              <AlertDialogMedia className="mb-0 size-9 shrink-0 rounded-full bg-destructive/10">
                <CircleAlert className="size-4! text-destructive" />
              </AlertDialogMedia>
              <AlertDialogTitle className="font-normal text-lg text-primary ltr:font-lora">
                {t("deleteAccount")}
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-4">
              <AlertDialogDescription className="text-sm text-primary/60 leading-relaxed text-start">
                {t("Dialog.description")}
              </AlertDialogDescription>

              <ul className="space-y-2">
                {REMOVED_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-primary/60"
                  >
                    <span className="size-1 rounded-full bg-destructive/60 shrink-0" />
                    {t(`Dialog.items.${item}`)}
                  </li>
                ))}
              </ul>
            </div>

            <AlertDialogFooter className="m-0 p-0 pt-1 border-none bg-transparent grid! grid-cols-2 gap-3">
              <AlertDialogCancel className="h-10 rounded-sm border-secondary bg-transparent font-normal text-primary/70 hover:bg-transparent hover:text-primary">
                {t("Dialog.cancel")}
              </AlertDialogCancel>

              <Button
                type="button"
                className="h-10 rounded-sm border border-destructive/20 bg-destructive/10 font-normal text-destructive hover:bg-destructive/15"
              >
                {t("Dialog.continue")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
