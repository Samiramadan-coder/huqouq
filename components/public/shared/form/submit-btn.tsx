import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRight } from "lucide-react";

export default function SubmitBtn({
  label,
  loading,
}: {
  label: string;
  loading: boolean;
}) {
  return (
    <Button type="submit" className="h-13 w-full rounded-sm">
      {loading ? <Spinner /> : label}
      <ArrowRight className="rtl:rotate-180" />
    </Button>
  );
}
