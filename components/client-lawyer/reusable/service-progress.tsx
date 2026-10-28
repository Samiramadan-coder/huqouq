import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type ProgressStep = {
  key: string;
  label: string;
  state: string; // "done" | "current" | "upcoming" | "skipped"
};

// Vertical progress list shared by the client and lawyer service pages; skipped steps are hidden
export default function ServiceProgress({
  title,
  steps,
}: {
  title: string;
  steps: ProgressStep[];
}) {
  const visibleSteps = steps.filter((step) => step.state !== "skipped");

  return (
    <div className="bg-white border border-secondary rounded-sm p-5">
      <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-4">
        {title}
      </h2>

      <ol className="flex flex-col gap-1">
        {visibleSteps.map((step) => {
          const isDone = step.state === "done";
          const isCurrent = step.state === "current";

          return (
            <li
              key={step.key}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-sm border px-2.5 py-2 text-sm",
                isCurrent
                  ? "border-accent/30 bg-accent/5 font-semibold text-primary"
                  : "border-transparent",
                isDone && "text-primary/70",
                !isDone && !isCurrent && "text-primary/25",
              )}
            >
              {isDone && (
                <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-accent">
                  <span className="flex size-2.5 items-center justify-center rounded-full border border-primary-foreground">
                    <Check
                      className="size-1.5 text-primary-foreground"
                      strokeWidth={4}
                      aria-hidden="true"
                    />
                  </span>
                </span>
              )}
              {isCurrent && (
                <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-primary">
                  <span className="size-1.5 rounded-full bg-background" />
                </span>
              )}
              {!isDone && !isCurrent && (
                <span className="size-4.5 shrink-0 rounded-full border border-secondary" />
              )}
              {step.label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
