"use client";

import { ReactNode } from "react";
import { Ban } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Where the client books a regular (paid) consultation instead
export const BOOK_CONSULTATION_HREF = "/client/find-lawyers";

// An icon, title and text, centred, for the request dialog's end states
export function StateMessage({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-6 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        {icon}
      </span>

      <div className="space-y-2">
        <DialogTitle className="text-xl ltr:font-lora">{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </div>

      {children && (
        <div className="flex flex-wrap justify-center gap-3">{children}</div>
      )}
    </div>
  );
}

// Link to book a consultation (when no emergency request is still searching)
export function BookConsultationButton({ onClick }: { onClick?: () => void }) {
  const t = useTranslations("Client.Emergency");

  return (
    <Button asChild className="h-10 rounded-sm px-6">
      <Link href={BOOK_CONSULTATION_HREF} onClick={onClick}>
        {t("bookConsultation")}
      </Link>
    </Button>
  );
}

// The API refused the request: the client used today's emergency calls
export function DailyLimitReached({
  message,
  onClose,
}: {
  message?: string;
  onClose: () => void;
}) {
  const t = useTranslations("Client.Emergency.DailyLimit");

  return (
    <StateMessage
      icon={<Ban className="size-7" aria-hidden="true" />}
      title={t("title")}
      description={message || t("description")}
    >
      <BookConsultationButton onClick={onClose} />
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="h-10 rounded-sm border-secondary px-6 font-normal text-primary/60"
      >
        {t("close")}
      </Button>
    </StateMessage>
  );
}
