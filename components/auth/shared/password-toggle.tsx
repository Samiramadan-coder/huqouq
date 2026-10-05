import { Eye, EyeOff } from "lucide-react";

export default function PasswordToggle({
  visible,
  onToggle,
  showLabel,
  hideLabel,
}: {
  visible: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={visible ? hideLabel : showLabel}
      aria-pressed={visible}
      className="cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={onToggle}
    >
      {visible ? (
        <Eye className="size-5" aria-hidden="true" />
      ) : (
        <EyeOff className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}
