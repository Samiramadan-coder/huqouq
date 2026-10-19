"use client";

import { useTranslations } from "next-intl";
import { Calendar, FolderOpen, LucideIcon, NotepadText } from "lucide-react";

export default function Stats({
  activeCases,
  hasOffers,
  upcomingConsultations,
}: {
  activeCases: number;
  hasOffers: number;
  upcomingConsultations: number;
}) {
  const t = useTranslations("Client.Dashboard");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        count={activeCases}
        label={t("activeCases")}
        icon={FolderOpen}
      />
      <StatCard
        count={hasOffers}
        label={t("pendingOffers")}
        icon={NotepadText}
      />
      <StatCard
        count={upcomingConsultations}
        label={t("upcomingConsultations")}
        icon={Calendar}
      />
    </div>
  );
}

function StatCard({
  count,
  label,
  icon,
}: {
  count: number;
  label: string;
  icon: LucideIcon;
}) {
  const Icon = icon;

  return (
    <div className="p-4 bg-white border border-secondary flex items-center gap-4 hover:border-accent/40">
      <div className="size-9 bg-background grid place-content-center">
        <Icon className="size-4 text-primary/45" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-primary leading-none ltr:font-lora">
          {count}
        </p>
        <p className="text-xs text-primary/45 mt-1">{label}</p>
      </div>
    </div>
  );
}
