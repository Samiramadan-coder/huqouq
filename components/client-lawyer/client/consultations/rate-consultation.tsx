"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "cn";
import { toast } from "sonner";
import { useState } from "react";
import { Star } from "lucide-react";
import Rating from "../../reusable/rating";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { rateConsultation } from "@/lib/client/consultations";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import { rateFormSchema, RateLawyerForm } from "@/types/client/my-cases";
import { Consultation, ConsultationReview } from "@/types/client/consultation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFormatters } from "@/lib/format";

// Quick tags shared with case reviews, so labels come from Client.Cases
const TAGS = [
  { key: "Responsive", value: "responsive" },
  { key: "GoodValue", value: "good_value" },
  { key: "Professional", value: "professional" },
  { key: "ClearCommunication", value: "clear_communication" },
  { key: "Knowledgeable", value: "knowledgeable" },
];

export default function RateConsultation({
  consultation,
  triggerClassName,
}: {
  consultation: Consultation;
  triggerClassName?: string;
}) {
  const t = useTranslations("Client.Consultations.Rate");
  const tCases = useTranslations("Client.Cases");
  const [open, setOpen] = useState(false);
  const { lawyer } = consultation;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RateLawyerForm>({
    resolver: zodResolver(rateFormSchema(tCases)),
    defaultValues: {
      rating: 0,
      comment: "",
      tags: [],
    },
  });

  async function onSubmit(data: RateLawyerForm) {
    const result = await rateConsultation(consultation.id, data);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      return;
    }

    toast.error(result.message ?? t("failed"));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "rounded-sm border-accent/40 bg-transparent text-accent font-normal text-xs hover:bg-accent/5 hover:text-accent",
            triggerClassName,
          )}
        >
          <Star className="size-3" aria-hidden="true" />
          {t("trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm ring-0!">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Avatar className="size-10">
                <AvatarImage
                  src={lawyer.photo_url ?? undefined}
                  alt={lawyer.name}
                />
                <AvatarFallback>{lawyer.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="text-start">
                <p className="text-sm text-primary font-semibold">
                  {lawyer.name}
                </p>
                <p className="text-primary/70 mt-0.5 text-xs font-normal">
                  {consultation.type_label} · {consultation.date_label}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <>
                <Rating value={field.value} onChange={field.onChange} />
                <FieldError errors={[errors.rating]} />
              </>
            )}
          />

          <FormTextarea
            register={register}
            name="comment"
            textareaClassName="border border-secondary"
            placeholder={tCases("CommentPlaceholder")}
          />

          <Controller
            control={control}
            name="tags"
            render={({ field }) => {
              const tags = field.value || [];

              return (
                <>
                  <p className="text-primary/50 text-xs mb-2 uppercase">
                    {tCases("QuickTags")}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {TAGS.map(({ key, value }) => (
                      <Badge
                        key={value}
                        asChild
                        className={cn(
                          "cursor-pointer h-8 border-secondary text-primary/50 font-normal text-xs px-4 bg-white rounded-sm",
                          tags.includes(value) && "bg-accent/20 text-accent",
                        )}
                      >
                        <button
                          type="button"
                          aria-pressed={tags.includes(value)}
                          onClick={() =>
                            field.onChange(
                              tags.includes(value)
                                ? tags.filter((tag) => tag !== value)
                                : [...tags, value],
                            )
                          }
                        >
                          {tCases(key)}
                        </button>
                      </Badge>
                    ))}
                  </div>
                </>
              );
            }}
          />

          <div>
            <Button
              className="w-full bg-accent rounded-sm h-12"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              {tCases("SubmitReview")}
            </Button>

            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-12 text-primary/50 text-xs"
              >
                {tCases("SkipForNow")}
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// The client's submitted review, shown read-only
export function ConsultationReviewView({
  review,
}: {
  review: ConsultationReview;
}) {
  const t = useTranslations("Client.Consultations.Rate");
  const format = useFormatters();
  const tags = review.tags ?? [];

  return (
    <div className="bg-background border-s-2 border-accent px-4 py-3 space-y-2">
      <p className="text-[11px] uppercase tracking-widest text-primary/40">
        {t("yourReview")}
      </p>
      <p
        className="flex items-center gap-1 text-sm text-primary"
        aria-label={`${format.number(review.rating)}/{format.number(5)}`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden="true"
            className={cn(
              "size-4 text-secondary",
              star <= review.rating && "fill-accent text-accent",
            )}
          />
        ))}
        <span className="ms-1 text-xs text-primary/60">{review.rating}/5</span>
      </p>
      {review.comment && (
        <p className="text-sm italic text-primary/60 leading-relaxed">
          &ldquo;{review.comment}&rdquo;
        </p>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => {
            return (
              <Badge
                key={tag.label}
                className="h-6 bg-accent/10 text-accent font-normal text-[11px] rounded-sm"
              >
                {tag.label}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
