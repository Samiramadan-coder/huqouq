import { checkPasswordStrength } from "@/lib/utils";

export default function PasswordStrength({
  password,
  labels,
}: {
  password: string;
  labels: { weak: string; medium: string; strong: string };
}) {
  if (!password) return null;

  const strength = checkPasswordStrength(password);
  const label =
    strength.score <= 33
      ? labels.weak
      : strength.score <= 66
        ? labels.medium
        : labels.strong;

  return (
    <div className="relative mt-1 flex items-center gap-4">
      <div className="flex w-full gap-1 relative">
        {Array.from({ length: 4 }).map((_, index) => {
          const segmentFill = Math.min(
            Math.max(strength.score - index * 25, 0),
            25,
          );

          return (
            <div
              key={index}
              className="h-0.5 flex-1 overflow-hidden rounded-full bg-gray-200"
            >
              <div
                className="h-full transition-all duration-300 ease-out"
                style={{
                  width: `${(segmentFill / 25) * 100}%`,
                  backgroundColor: strength.color,
                }}
              />
            </div>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="mb-1 shrink-0 text-[11px] font-medium"
        style={{ color: strength.color }}
      >
        {label}
      </p>
    </div>
  );
}
