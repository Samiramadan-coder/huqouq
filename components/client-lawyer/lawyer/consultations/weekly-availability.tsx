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
import { Control, Controller, useWatch } from "react-hook-form";

type Props = {
  control: Control<AvailabilitySettings>;
  options: Options;
};

const MINUTES_PER_DAY = 24 * 60;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatMinutes = (total: number) =>
  [Math.floor(total / 60), total % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");

// A slot always lasts exactly `slotMinutes`, so its end is derived from its start
export const withSlotEnd = (from: string, slotMinutes: number): TimeSlot => ({
  from,
  to: from ? formatMinutes(toMinutes(from) + slotMinutes) : "",
});

export const withSlotEnds = (
  weekly: AvailabilitySettings["weekly"],
  slotMinutes: number,
) =>
  Object.fromEntries(
    Object.entries(weekly).map(([day, slots]) => [
      day,
      slots.map((slot) => withSlotEnd(slot.from, slotMinutes)),
    ]),
  ) as AvailabilitySettings["weekly"];

export default function WeeklyAvailability({ control, options }: Props) {
  const slotMinutes = useWatch({ control, name: "slot_minutes" });

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
                slotMinutes={slotMinutes}
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
  slotMinutes: number;
  onSlotsChange: (slots: TimeSlot[]) => void;
};

function DayAvailability({
  day,
  label,
  slots,
  timeStepMinutes,
  slotMinutes,
  onSlotsChange,
}: DayAvailabilityProps) {
  const t = useTranslations(
    "Lawyer.Consultations.AvailabilitySettings.Fields.WeeklyAvailability",
  );

  const updateSlotStart = (index: number, from: string) =>
    onSlotsChange(
      slots.map((slot, i) =>
        i === index ? withSlotEnd(from, slotMinutes) : slot,
      ),
    );

  // Latest start that still lets the slot end by midnight
  const latestStart = formatMinutes(MINUTES_PER_DAY - slotMinutes);

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
                <Input
                  type="time"
                  step={timeStepMinutes * 60}
                  max={latestStart}
                  value={slot.from}
                  aria-label={`${label} ${t("From")}`}
                  className="w-32 rounded-sm border border-secondary bg-background"
                  onChange={(e) => updateSlotStart(index, e.target.value)}
                />

                <Input
                  type="time"
                  readOnly
                  tabIndex={-1}
                  value={withSlotEnd(slot.from, slotMinutes).to}
                  aria-label={`${label} ${t("To")}`}
                  className="w-32 rounded-sm border border-secondary bg-muted"
                />

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
