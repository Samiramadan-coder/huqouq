"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import z from "zod";
import { cn } from "cn";
import { toast } from "sonner";
import { useRef } from "react";
import { T } from "@/types/shared";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { rateService } from "@/lib/client/legal-services";
import Rating from "@/components/client-lawyer/reusable/rating";
import FormTextarea from "@/components/public/shared/form/form-textarea";

const ratingSchema = (t: T) =>
  z.object({
    rating: z.number().min(1, t("ratingRequired")),
    comment: z.string(),
  });

export type RatingSchema = z.infer<ReturnType<typeof ratingSchema>>;

export default function RateService({ serviceId }: { serviceId: number }) {
  const locale = useLocale();
  const t = useTranslations("Client.LegalServices");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const fontClass = locale === "en" ? "font-lora" : "";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RatingSchema>({
    resolver: zodResolver(ratingSchema(t)),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  async function handleRateService(data: RatingSchema) {
    const result = await rateService(serviceId, data);

    if (result.success) {
      toast.success(result.message);
      closeBtn.current?.click();
      return;
    }

    if (result.message) {
      toast.error(result.message);
      return;
    }

    toast.error(t("errorRating"));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 border border-accent/40 text-accent  text-sm font-semibold px-4 py-2 rounded-sm hover:bg-accent/8 transition-colors duration-200">
          <Star className="size-5" />
          {t("rateThisService")}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm ring-0!">
        <DialogHeader>
          <DialogTitle>
            <p className={cn("text-lg font-bold", fontClass)}>
              {t("rateThisService")}
            </p>
          </DialogTitle>
        </DialogHeader>

        <form
          ref={form}
          onSubmit={(e) => {
            handleSubmit(handleRateService)(e);
          }}
          className="space-y-4"
        >
          <Controller
            control={control}
            name={`rating`}
            render={({ field }) => {
              return (
                <>
                  <Rating
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError errors={[errors.rating]} />
                </>
              );
            }}
          />

          <FormTextarea
            register={register}
            name="comment"
            textareaClassName="border border-secondary"
            placeholder={t("commentPlaceholder")}
          />

          <div>
            <Button className="w-full bg-accent rounded-sm h-12" type="submit">
              {isSubmitting && <Spinner />}
              {t("submitReview")}
            </Button>

            <DialogClose asChild>
              <Button
                type="button"
                ref={closeBtn}
                variant="ghost"
                className="w-full h-12 text-primary/50 text-xs"
              >
                {t("skipForNow")}
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
