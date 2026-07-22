import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

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
    </Button>
  );
}
