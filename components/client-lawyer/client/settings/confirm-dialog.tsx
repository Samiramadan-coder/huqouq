"use client";

import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const REMOVED_ITEMS = [
  "profile",
  "cases",
  "consultations",
  "messages",
  "documents",
] as const;

export default function ConfirmDialog() {
  const t = useTranslations("Client.Settings.DangerZone");
  return (
    <>
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
    </>
  );
}
