import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function TimelineRail({
  completed,
  current,
  last,
}: {
  completed: boolean;
  current: boolean;
  last: boolean;
}) {
  return (
    <div className="relative flex w-5 justify-center">
      {!last && (
        <span
          className={cn(
            "absolute left-1/2 top-5 bottom-0 w-px -translate-x-1/2",
            completed ? "bg-accent/60" : "bg-secondary",
          )}
        />
      )}

      {completed && (
        <div className="bg-accent relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full">
          <div className="flex size-3 items-center justify-center rounded-full border border-primary-foreground">
            <Check className="size-2 text-primary-foreground" />
          </div>
        </div>
      )}

      {current && (
        <div className="bg-foreground relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full">
          <span className="size-1.5 rounded-full bg-background" />
        </div>
      )}

      {!completed && !current && (
        <div className="bg-background relative z-10 size-5 shrink-0 rounded-full border-2 border-secondary" />
      )}
    </div>
  );
}
