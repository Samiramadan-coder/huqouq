import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SubmitBtn({
  label,
  loading,
  className,
  showArrow = true,
}: {
  label: string;
  loading: boolean;
  className?: string;
  showArrow?: boolean;
}) {
  return (
    <Button type="submit" className={cn("h-13 w-full rounded-sm", className)}>
      {loading ? <Spinner /> : label}
      {showArrow && <ArrowRight className="rtl:rotate-180" />}
    </Button>
  );
}
