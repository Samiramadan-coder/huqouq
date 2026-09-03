"use client";

import { useLocale } from "next-intl";
import { Calendar, FolderOpen, LucideIcon, NotepadText } from "lucide-react";

export default function Stats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard count={2} label="Active Cases" icon={FolderOpen} />
      <StatCard count={5} label="Pending offers" icon={NotepadText} />
      <StatCard count={1} label="Upcoming consultations" icon={Calendar} />
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
  const locale = useLocale();
  const fontClass = locale === "en" ? "font-lora" : "";
  const Icon = icon;

  return (
    <div className="p-4 bg-white border border-secondary flex items-center gap-4">
      <div className="size-9 bg-background grid place-content-center">
        <Icon className="size-4 text-primary/45" />
      </div>
      <div>
        <p
          className={`text-2xl font-semibold text-primary leading-none ${fontClass}`}
        >
          {count}
        </p>
        <p className="text-xs text-primary/45 mt-1">{label}</p>
      </div>
    </div>
  );
}
