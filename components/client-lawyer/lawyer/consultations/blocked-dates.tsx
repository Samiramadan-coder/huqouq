import { X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Control, Controller } from "react-hook-form";
import { AvailabilitySettings } from "@/types/lawyer/consultations";

type Props = {
  control: Control<AvailabilitySettings>;
};

export default function BlockedDates({ control }: Props) {
  const t = useTranslations(
    "Lawyer.Consultations.AvailabilitySettings.Fields.BlockedDates",
  );
  const [blockedDate, setBlockedDate] = useState("");

  return (
    <Controller
      control={control}
      name="blocked_dates"
      render={({ field }) => {
        const { value, onChange } = field;
        const isDuplicate = value.includes(blockedDate);

        return (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-primary/40 leading-relaxed">
              {t("Hint")}
            </p>

            <div className="flex items-stretch gap-2">
              <Input
                type="date"
                className="rounded-sm h-11 border border-secondary bg-background"
                value={blockedDate}
                onChange={(e) => setBlockedDate(e.target.value)}
              />

              <Button
                disabled={!blockedDate || isDuplicate}
                type="button"
                className="h-11 px-4 text-xs rounded-sm"
                onClick={() => {
                  onChange([...value, blockedDate].sort());
                  setBlockedDate("");
                }}
              >
                {t("Add")}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {value.map((date) => (
                <Badge
                  key={date}
                  className="text-xs font-normal rounded-xs py-3 px-2 bg-background text-primary border-secondary"
                >
                  {date}

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="px-0!"
                    aria-label={t("Remove", { date })}
                    onClick={() => onChange(value.filter((d) => d !== date))}
                  >
                    <X className="size-4" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
