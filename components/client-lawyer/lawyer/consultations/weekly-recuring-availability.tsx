import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Control, Controller } from "react-hook-form";
import { AvailabilitySettings, Options } from "@/types/lawyer/consultations";

type Props = {
  control: Control<AvailabilitySettings>;
  options: Options;
};

export default function WeeklyRecuringAvailability({
  control,
  options,
}: Props) {
  return (
    <Controller
      control={control}
      name="weekly"
      render={({ field }) => {
        const { value, onChange } = field;

        const days = Object.entries(value).map(([day, slots]) => ({
          day,
          slots,
        }));

        return (
          <Accordion
            type="multiple"
            className="*:data-[slot=accordion-item]:border-secondary"
          >
            {days.map((day) => {
              const dayLabel =
                options.days.find((d) => d.key === day.day)?.label ?? day.day;

              return (
                <AccordionItem key={day.day} value={day.day}>
                  <div className="flex items-center gap-2">
                    <Switch
                      aria-label={`Toggle availability for ${dayLabel}`}
                      checked={day.slots.length > 0}
                    />
                    <div className="flex-1">
                      <AccordionTrigger className="font-bold">
                        {dayLabel}
                      </AccordionTrigger>
                    </div>
                  </div>

                  <AccordionContent>
                    <div className="space-y-3 px-8 pt-4">
                      {day.slots.length > 0 ? (
                        day.slots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="flex items-center gap-2"
                          >
                            {(["from", "to"] as const).map((key) => (
                              <Input
                                key={key}
                                type="time"
                                step={options.time_step_minutes * 60}
                                value={slot[key]}
                                aria-label={`${dayLabel} ${key}`}
                                className="w-32 rounded-sm border border-secondary bg-background"
                                onChange={(e) =>
                                  onChange({
                                    ...value,
                                    [day.day]: day.slots.map((s, i) =>
                                      i === slotIndex
                                        ? { ...s, [key]: e.target.value }
                                        : s,
                                    ),
                                  })
                                }
                              />
                            ))}

                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              aria-label={`Remove slot ${slotIndex + 1} for ${dayLabel}`}
                              onClick={() =>
                                onChange({
                                  ...value,
                                  [day.day]: day.slots.filter(
                                    (_, i) => i !== slotIndex,
                                  ),
                                })
                              }
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-primary/70 text-xs">
                          No time slots available
                        </p>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        className="text-accent text-xs p-0 hover:bg-transparent hover:text-accent"
                        aria-label={`Add slot for ${dayLabel}`}
                        onClick={() =>
                          onChange({
                            ...value,
                            [day.day]: [...day.slots, { from: "", to: "" }],
                          })
                        }
                      >
                        <Plus className="size-3" />
                        Add time slot
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        );
      }}
    />
  );
}
