"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import z from "zod";
import { toast } from "sonner";
import { useRef } from "react";
import { T } from "@/types/shared";
import { useForm } from "react-hook-form";
import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestRevision } from "@/lib/client/legal-services";
import FormTextarea from "@/components/public/shared/form/form-textarea";

const requestRevisionSchema = (t: T) =>
  z.object({
    note: z.string().min(1, t("noteRequired")),
  });

export type RequestRevisionFormValues = z.infer<
  ReturnType<typeof requestRevisionSchema>
>;

export default function RequestRevision({ serviceId }: { serviceId: number }) {
  const t = useTranslations("Client.LegalServices");
  const closeBtn = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestRevisionFormValues>({
    resolver: zodResolver(requestRevisionSchema(t)),
    defaultValues: { note: "" },
  });

  async function onSubmit(data: RequestRevisionFormValues) {
    const result = await requestRevision(data, serviceId);

    if (result.success) {
      toast.success(result.message);
      closeBtn.current?.click();
      return;
    }

    if (result.message) {
      toast.error(result.message);
      return;
    }

    toast.error(t("requestRevisionFailed"));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-10.5 inline-flex items-center gap-2 bg-white border border-amber-400 text-amber-700 text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-white hover:text-amber-700 transition-colors duration-200"
        >
          <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
          {t("requestRevision")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm ring-0! rounded-sm">
        <DialogHeader>
          <DialogTitle>{t("requestRevision")}</DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={(e) => handleSubmit(onSubmit)(e)}>
          <FormTextarea
            name="note"
            register={register}
            required
            disabled={isSubmitting}
            errors={errors}
            textareaClassName="border border-secondary"
          />
        </form>

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={() => formRef.current?.requestSubmit()}
            className="bg-amber-600 text-white border-secondary hover:bg-amber-700 rounded-sm h-11 flex-1"
          >
            {isSubmitting && <Spinner />}
            {t("requestRevision")}
          </Button>
          <DialogClose asChild ref={closeBtn}>
            <Button
              variant="outline"
              className="bg-transparent border-secondary rounded-sm h-11 flex-1"
            >
              {t("cancel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
