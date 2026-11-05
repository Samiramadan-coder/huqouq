import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function DialogIconHeader({
  icon,
  iconClassName,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  description?: string;
}) {
  return (
    <DialogHeader className="flex-row items-center gap-3 text-start">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          iconClassName,
        )}
      >
        {icon}
      </span>
      <div className="space-y-1">
        <DialogTitle className="ltr:font-lora text-lg">{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </div>
    </DialogHeader>
  );
}
