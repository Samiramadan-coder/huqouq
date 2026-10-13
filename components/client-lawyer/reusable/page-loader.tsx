import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LoaderPinwheelIcon } from "lucide-react";

// Loading indicator for a route segment or a Suspense fallback
export default function PageLoader({ className }: { className?: string }) {
  const t = useTranslations("Common");

  return (
    <div role="status" aria-label={t("Loading")} className={cn(className)}>
      <LoaderPinwheelIcon
        className="animate-spin text-accent"
        aria-hidden="true"
      />
    </div>
  );
}
