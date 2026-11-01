import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export default function AreaButton({
  disabled = false,
  label,
  type,
  className,
  onClick,
}: {
  disabled?: boolean;
  label: string;
  type: "submit" | "button";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={() => onClick?.()}
      className={cn(
        "text-accent font-normal text-xs cursor-pointer flex items-center gap-1 disabled:opacity-50",
        className,
      )}
    >
      {disabled && <Spinner className="size-3" />}
      {label}
    </button>
  );
}
