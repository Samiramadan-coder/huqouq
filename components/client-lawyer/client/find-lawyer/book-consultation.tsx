"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

import z from "zod";
import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { T } from "@/types/shared";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { LawyerDetails } from "@/types/client/find-lawyer";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { requestConsultation } from "@/lib/client/find-lawyer";
import { toast } from "sonner";

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

const bookSchema = (t: T) =>
  z.object({
    type: z.string(),
    date: z.string().min(1, t("dateRequired")),
    time: z.string().min(1, t("timeRequired")),
    brief: z.string().optional(),
    amount: z.number(),
  });

export type BookFormValues = z.infer<ReturnType<typeof bookSchema>>;

const requiredLabelClassName =
  "text-xs font-semibold uppercase tracking-widest text-primary/50 after:ms-1 after:text-destructive after:content-['*']";

const optionClassName =
  "text-primary/50 p-3 border border-secondary rounded-sm bg-transparent cursor-pointer";

const selectedOptionClassName = "bg-primary text-white";

export default function BookConsultations({
  lawyerDetails,
}: {
  lawyerDetails: LawyerDetails;
}) {
  const t = useTranslations("Client.FindLawyer");
  const tBook = useTranslations("Client.FindLawyer.bookConsultation");

  const { consultation } = lawyerDetails;

  const duration = tBook("minutes", {
    count: consultation?.duration_minutes ?? 0,
  });

  const [open, setOpen] = useState(false);
  const [bookableDays, setBookableDays] = useState<BookableDay[]>([]);

  useEffect(() => {
    if (!open) return;

    const fetchBookableDays = async () => {
      try {
        const { data } = await http.get<{ data: { days: BookableDay[] } }>(
          `/api/lawyers/${lawyerDetails.id}/consultation-slots`,
        );

        setBookableDays(data.data.days);
      } catch (error) {
        console.error("Failed to fetch bookable times:", error);
      }
    };

    fetchBookableDays();
  }, [lawyerDetails.id, open]);

  const {
    control,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema(tBook)),
    defaultValues: {
      type: consultation?.types[0]?.value,
      date: "",
      time: "",
      brief: "",
      amount: consultation?.price ?? 0,
    },
  });

  const selectedDate = useWatch({ control, name: "date" });

  const availableDays = bookableDays.filter((day) => day.available);

  const availableSlots =
    bookableDays
      .find((day) => day.date === selectedDate)
      ?.slots.filter((slot) => !slot.booked) ?? [];

  const onSubmit: SubmitHandler<BookFormValues> = async (values) => {
    const result = await requestConsultation(lawyerDetails.id, values);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      return;
    }

    Object.entries(result.errors ?? {}).forEach(([field, message]) => {
      if (!message) return;

      setError(field as keyof BookFormValues, {
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
          className="h-15 w-full flex-col gap-0 rounded border-accent bg-white hover:bg-[#fffdf8]"
        >
          <span className="text-sm text-accent">{t("bookAConsultation")}</span>
          <span className="text-[11px] font-normal text-accent">
            {t("freeLaunchPeriod")}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl ring-0! rounded-sm">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Avatar className="size-14">
                <AvatarImage
                  src={lawyerDetails.photo_url ?? undefined}
                  alt={lawyerDetails.name}
                />
                <AvatarFallback>{lawyerDetails.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-primary font-semibold">
                  {lawyerDetails.name}
                </p>
                <p className="text-primary/70 mt-0.5 text-xs">
                  {lawyerDetails.specializations.map((s) => s.name).join(", ")}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div>
                <FieldLabel className={cn("mb-2", requiredLabelClassName)}>
                  {tBook("consultationType")}
                </FieldLabel>
                <RadioGroup
                  className="w-full flex gap-2"
                  orientation="horizontal"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {consultation?.types.map((type) => (
                    <FieldLabel
                      key={type.value}
                      htmlFor={`type-${type.value}`}
                      className="flex-1 border border-secondary p-3 rounded-xs! cursor-pointer has-data-[state=checked]:border-primary"
                    >
                      <Field orientation="horizontal">
                        <RadioGroupItem
                          value={type.value}
                          id={`type-${type.value}`}
                        />
                        <FieldContent>
                          <FieldTitle>{type.label}</FieldTitle>
                          <FieldDescription className="text-xs text-primary/50 mt-7">
                            {duration}
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </div>
            )}
          />

          <Controller
            control={control}
            name="date"
            render={({ field: { value, onChange } }) => (
              <div className="space-y-2">
                <FieldLabel className={requiredLabelClassName}>
                  {tBook("selectDate")}
                </FieldLabel>
                <div className="flex items-center gap-2 flex-wrap">
                  {availableDays.map((day) => (
                    <Badge
                      key={day.date}
                      asChild
                      className={cn(
                        optionClassName,
                        value === day.date && selectedOptionClassName,
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
                  <FieldLabel className={requiredLabelClassName}>
                    {tBook("availableTimes")}
                  </FieldLabel>
                  <div className="flex items-center gap-2 flex-wrap">
                    {availableSlots.map((slot) => (
                      <Badge
                        key={slot.label}
                        asChild
                        className={cn(
                          optionClassName,
                          "p-4 text-sm",
                          value === slot.label && selectedOptionClassName,
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

          <FormTextarea
            register={register}
            name="brief"
            label={tBook("briefLabel")}
            placeholder={tBook("briefPlaceholder")}
            textareaClassName="border border-secondary"
          />

          <div className="bg-background border border-secondary rounded-sm px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-sans text-xs text-primary/40 tracking-wide uppercase">
                {tBook("price")}
              </p>
              <p className="font-sans text-base font-semibold text-accent mt-0.5">
                {consultation?.currency} {consultation?.price} / {duration}
              </p>
            </div>
            <p className="font-sans text-xs text-primary/40 text-end">
              {tBook("sessionInfo", {
                count: consultation?.duration_minutes ?? 0,
              })}
            </p>
          </div>

          <SubmitBtn
            loading={isSubmitting}
            label={tBook("continueToPayment")}
            className="bg-accent hover:bg-accent/80"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
