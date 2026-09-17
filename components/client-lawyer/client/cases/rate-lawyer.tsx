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
import { useRef } from "react";
import { Star } from "lucide-react";
import Rating from "../../reusable/rating";
import { Button } from "@/components/ui/button";
import { rateLawyer } from "@/lib/client/cases";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Case, rateFormSchema, RateLawyerForm } from "@/types/client/my-cases";
import { Badge } from "@/components/ui/badge";

export default function RateLawyer({ caseItem }: { caseItem: Case }) {
  const locale = useLocale();
  const t = useTranslations("Client.Cases");
  const form = useRef<HTMLFormElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const fontClass = locale === "en" ? "font-lora" : "";

  const availableTags = [
    { label: t("Responsive"), value: "responsive" },
    { label: t("GoodValue"), value: "good_value" },
    { label: t("Professional"), value: "professional" },
    { label: t("ClearCommunication"), value: "clear_communication" },
    { label: t("Knowledgeable"), value: "knowledgeable" },
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RateLawyerForm>({
    resolver: zodResolver(rateFormSchema(t)),
    defaultValues: {
      rating: 0,
      comment: "",
      tags: [],
    },
  });

  async function handleRateLawyer(data: RateLawyerForm) {
    const result = await rateLawyer({ caseId: caseItem.id, review: data });

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
        <Button
          variant="ghost"
          className="px-0 text-primary text-xs hover:bg-transparent hover:text-primary"
        >
          <Star className="size-3" />
          <span>{t("rate")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm ring-0!">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Avatar className="size-10">
                <AvatarImage
                  src={caseItem.hired_lawyer?.photo_url}
                  alt={caseItem.hired_lawyer?.name}
                />
                <AvatarFallback>
                  {caseItem.hired_lawyer?.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p
                  className={cn(
                    "text-sm text-primary font-semibold",
                    fontClass,
                  )}
                >
                  {caseItem.hired_lawyer?.name}
                </p>
                <p className="text-primary/70 mt-0.5 text-xs">
                  {caseItem.specialization.name}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form
          ref={form}
          onSubmit={(e) => {
            handleSubmit(handleRateLawyer)(e);
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
            placeholder={t("CommentPlaceholder")}
          />

          <Controller
            control={control}
            name="tags"
            render={({ field }) => {
              const tags = field.value || [];

              return (
                <>
                  <p className="text-primary/50 text-xs mb-2 uppercase">
                    {t("QuickTags")}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(({ label, value }) => (
                      <Badge
                        key={value}
                        onClick={() => {
                          if (tags.includes(value)) {
                            field.onChange(tags.filter((tag) => tag !== value));
                          } else {
                            field.onChange([...tags, value]);
                          }
                        }}
                        className={cn(
                          "cursor-pointer h-8 border-secondary text-primary/50 font-normal text-xs px-4 bg-white rounded-sm",
                          tags.includes(value) && "bg-accent/20 text-accent",
                        )}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>

                  <FieldError errors={[errors.tags]} />
                </>
              );
            }}
          />

          <div>
            <Button className="w-full bg-accent rounded-sm h-12" type="submit">
              {isSubmitting && <Spinner />}
              {t("SubmitReview")}
            </Button>

            <DialogClose asChild>
              <Button
                type="button"
                ref={closeBtn}
                variant="ghost"
                className="w-full h-12 text-primary/50 text-xs"
              >
                {t("SkipForNow")}
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
