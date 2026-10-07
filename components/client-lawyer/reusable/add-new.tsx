import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";

export default function AddNew({
  children,
  href,
}: {
  children?: React.ReactNode;
  href: string;
}) {
  return (
    <Button
      asChild
      className="h-10 px-4 rounded-sm font-normal bg-accent hover:bg-accent/80"
    >
      <Link href={href}>
        <Plus aria-hidden="true" />
        {children}
      </Link>
    </Button>
  );
}
