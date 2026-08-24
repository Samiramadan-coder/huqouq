import { LucideIcon } from "lucide-react";

export default function InfoRow({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  const IconComponent = icon;
  return (
    <div className="flex items-start gap-2">
      <IconComponent className="text-primary/40 size-3.5 relative top-1" />
      <div>
        <span className="uppercase text-xs text-primary/55">{label}</span>
        <p className="mt-0.5">{value}</p>
      </div>
    </div>
  );
}
