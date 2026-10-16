"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { T } from "@/types/shared";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, FieldLabel } from "@/components/ui/field";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { rescheduleConsultation } from "@/lib/client/consultations";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";

type BookableDay = {
  available: boolean;
  date: string;
  label: string;
  slots: {
    booked: boolean;
    label: string;
    starts_at: string;
    time: string;
  }[];
};

const reschedualeSchema = (t: T) =>
  z.object({
    date: z.string().min(1, t("dateRequired")),
    time: z.string().min(1, t("timeRequired")),
  });

export type RescheduleFormValues = z.infer<
  ReturnType<typeof reschedualeSchema>
>;

export default function Reschedule({
  lawyerId,
  consultationId,
}: {
  lawyerId: number;
  consultationId: number;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Client.Consultations.Details");
  const [bookableDays, setBookableDays] = useState<BookableDay[]>([]);

  useEffect(() => {
    if (!open) return;

    const fetchBookableDays = async () => {
      try {
        const { data } = await http.get<{ data: { days: BookableDay[] } }>(
          `/api/lawyers/${lawyerId}/consultation-slots`,
        );

        setBookableDays(data.data.days);
      } catch (error) {
        console.error("Failed to fetch bookable times:", error);
      }
    };

    fetchBookableDays();
  }, [lawyerId, open]);

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RescheduleFormValues>({
    resolver: zodResolver(reschedualeSchema(t)),
    defaultValues: {
      date: "",
      time: "",
    },
  });

  const selectedDate = useWatch({ control, name: "date" });
  const availableDays = bookableDays.filter((day) => day.available);
  const availableSlots =
    bookableDays
      .find((day) => day.date === selectedDate)
      ?.slots.filter((slot) => !slot.booked) ?? [];

  const onSubmit: SubmitHandler<RescheduleFormValues> = async (values) => {
    const result = await rescheduleConsultation(consultationId, values);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      return;
    }

    Object.entries(result.errors ?? {}).forEach(([field, message]) => {
      if (!message) return;
      setError(field as keyof RescheduleFormValues, {
        type: "manual",
        message,
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-sm border-secondary bg-transparent text-primary/60 font-normal"
        >
          {t("reschedule")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl ring-0! rounded-sm">
        <DialogHeader>
          <DialogTitle>{t("reschedule")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            control={control}
            name="date"
            render={({ field: { value, onChange } }) => (
              <div className="space-y-2">
                <FieldLabel className="text-xs font-semibold uppercase tracking-widest text-primary/50 after:ms-1 after:text-destructive after:content-['*']">
                  {t("selectDate")}
                </FieldLabel>
                <div className="flex items-center gap-2 flex-wrap">
                  {availableDays.map((day) => (
                    <Badge
                      key={day.date}
                      asChild
                      className={cn(
                        "text-primary/50 p-3 border border-secondary rounded-sm bg-transparent cursor-pointer",
                        value === day.date && "bg-primary text-white",
                      )}
                    >
                      <button
                        type="button"
                        aria-pressed={value === day.date}
                        onClick={() => onChange(day.date)}
                      >
                        {day.label}
                      </button>
                    </Badge>
                  ))}
                </div>
                <FieldError errors={[errors.date]} />
              </div>
            )}
          />

          {selectedDate && (
            <Controller
              control={control}
              name="time"
              render={({ field: { value, onChange } }) => (
                <div className="space-y-2">
                  <FieldLabel className="text-xs font-semibold uppercase tracking-widest text-primary/50 after:ms-1 after:text-destructive after:content-['*']">
                    {t("availableTimes")}
                  </FieldLabel>
                  <div className="flex items-center gap-2 flex-wrap">
                    {availableSlots.map((slot) => (
                      <Badge
                        key={slot.label}
                        asChild
                        className={cn(
                          "text-primary/50 p-3 border border-secondary rounded-sm bg-transparent cursor-pointer",
                          "p-4 text-sm",
                          value === slot.label && "bg-primary text-white",
                        )}
                      >
                        <button
                          type="button"
                          aria-pressed={value === slot.label}
                          onClick={() => onChange(slot.label)}
                        >
                          {slot.label}
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FieldError errors={[errors.time]} />
                </div>
              )}
            />
          )}

          <SubmitBtn
            loading={isSubmitting}
            label={t("reschedule")}
            className="bg-accent hover:bg-accent/80"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
