import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Options,
  Weekday,
  TimeSlot,
  AvailabilitySettings,
} from "@/types/lawyer/consultations";

import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Control, Controller } from "react-hook-form";

type Props = {
  control: Control<AvailabilitySettings>;
  options: Options;
};

export default function WeeklyAvailability({ control, options }: Props) {
  return (
    <Controller
      control={control}
      name="weekly"
      render={({ field: { value, onChange } }) => (
        <Accordion
          type="multiple"
          className="*:data-[slot=accordion-item]:border-secondary"
        >
          {(Object.entries(value) as [Weekday, TimeSlot[]][]).map(
            ([day, slots]) => (
              <DayAvailability
                key={day}
                day={day}
                label={options.days.find((d) => d.key === day)?.label ?? day}
                slots={slots}
                timeStepMinutes={options.time_step_minutes}
                onSlotsChange={(newSlots) =>
                  onChange({ ...value, [day]: newSlots })
                }
              />
            ),
          )}
        </Accordion>
      )}
    />
  );
}

type DayAvailabilityProps = {
  day: Weekday;
  label: string;
  slots: TimeSlot[];
  timeStepMinutes: number;
  onSlotsChange: (slots: TimeSlot[]) => void;
};

function DayAvailability({
  day,
  label,
  slots,
  timeStepMinutes,
  onSlotsChange,
}: DayAvailabilityProps) {
  const t = useTranslations(
    "Lawyer.Consultations.AvailabilitySettings.Fields.WeeklyAvailability",
  );

  const updateSlot = (index: number, key: keyof TimeSlot, time: string) =>
    onSlotsChange(
      slots.map((slot, i) => (i === index ? { ...slot, [key]: time } : slot)),
    );

  return (
    <AccordionItem value={day}>
      <div className="flex items-center gap-2">
        <Switch
          aria-label={t("ToggleDay", { day: label })}
          checked={slots.length > 0}
        />
        <div className="flex-1">
          <AccordionTrigger className="font-bold">{label}</AccordionTrigger>
        </div>
      </div>

      <AccordionContent>
        <div className="space-y-3 px-8 pt-4">
          {slots.length > 0 ? (
            slots.map((slot, index) => (
              <div key={index} className="flex items-center gap-2">
                {(["from", "to"] as const).map((key) => (
                  <Input
                    key={key}
                    type="time"
                    step={timeStepMinutes * 60}
                    value={slot[key]}
                    aria-label={`${label} ${t(key === "from" ? "From" : "To")}`}
                    className="w-32 rounded-sm border border-secondary bg-background"
                    onChange={(e) => updateSlot(index, key, e.target.value)}
                  />
                ))}

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={t("RemoveSlot", { index: index + 1, day: label })}
                  onClick={() =>
                    onSlotsChange(slots.filter((_, i) => i !== index))
                  }
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-primary/70 text-xs">{t("NoSlots")}</p>
          )}

          <Button
            type="button"
            variant="ghost"
            className="text-accent text-xs p-0 hover:bg-transparent hover:text-accent"
            onClick={() => onSlotsChange([...slots, { from: "", to: "" }])}
          >
            <Plus className="size-3" />
            {t("AddSlot")}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
