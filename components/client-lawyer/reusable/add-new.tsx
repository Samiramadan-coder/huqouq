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
    <Link href={href}>
      <Button className="h-10 px-4 rounded-sm font-normal bg-accent hover:bg-accent/80">
        <Plus />
        {children}
      </Button>
    </Link>
  );
}
