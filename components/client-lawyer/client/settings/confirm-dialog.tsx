"use client";

import {
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import {
  WhyDeleteReason,
  REASON_TEXT_MAX,
  deleteAccountSchema,
  DeleteAccountFormValues,
} from "@/types/client/settings";

import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signOutOfFirebase } from "@/features/chat";
import { unregisterPushNotifications } from "@/features/push-notifications";
import { useUser } from "@/providers/user-provider";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { useResendCooldown } from "@/hook/use-resend-cooldown";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, ShieldAlert } from "lucide-react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import FormInput from "@/components/public/shared/form/form-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { deleteAccount, requestDeletionCode } from "@/lib/client/settings";

const REMOVED_ITEMS = [
  "profile",
  "cases",
  "consultations",
  "messages",
  "documents",
] as const;

const LOGOUT_URL = "/api/auth/logout?next=/";

export default function ConfirmDialog({
  reasons,
}: {
  reasons: WhyDeleteReason[];
}) {
  const t = useTranslations("Client.Settings.DangerZone");
  const format = useFormatters();
  const { secondsLeft, restart } = useResendCooldown(false);
  const { setUser } = useUser();
  const [step, setStep] = useState<"warning" | "confirm">("warning");
  const [isSendingCode, setIsSendingCode] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema(t)),
    defaultValues: { code: "", reason_text: "" },
  });

  const isOther = useWatch({ control, name: "reason" }) === "other";

  const sendCode = async () => {
    setIsSendingCode(true);

    const result = await requestDeletionCode();

    setIsSendingCode(false);

    if (!result.success) {
      return toast.error(result.message ?? t("Dialog.sendCodeError"));
    }

    restart();

    if (step === "warning") {
      if (result.message) toast.success(result.message);
      return setStep("confirm");
    }

    toast.success(result.message ?? t("Dialog.Confirm.resendSuccess"));
  };

  const onSubmit: SubmitHandler<DeleteAccountFormValues> = async (data) => {
    // reason_text only applies to "other"; drop leftovers from switching reason
    const result = await deleteAccount(
      data.reason === "other" ? data : { ...data, reason_text: undefined },
    );

    if (result.success) {
      // The account (and its devices) is gone; only delete the FCM token
      await unregisterPushNotifications({ notifyApi: false });
      await signOutOfFirebase();
      setUser(null);

      // Clear the token cookie, go home and show the message as a toast
      window.location.replace(
        `${LOGOUT_URL}&message=${encodeURIComponent(t("Dialog.Confirm.success"))}`,
      );
      return;
    }

    const fieldErrors = Object.entries(result.errors ?? {}).filter(
      ([, message]) => message,
    );

    fieldErrors.forEach(([field, message]) =>
      setError(field as keyof DeleteAccountFormValues, {
        type: "server",
        message,
      }),
    );

    if (!fieldErrors.length) {
      toast.error(result.message ?? t("commonError"));
    }
  };

  if (step === "warning") {
    return (
      <>
        <AlertDialogHeader className="flex! flex-row items-center gap-3 text-start">
          <AlertDialogMedia className="mb-0 size-9 shrink-0 rounded-full bg-destructive/10">
            <CircleAlert className="size-4! text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-normal text-lg text-primary ltr:font-lora">
            {t("deleteAccount")}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <AlertDialogDescription className="text-sm text-primary/60 leading-relaxed text-start">
            {t("Dialog.description")}
          </AlertDialogDescription>

          <ul className="space-y-2">
            {REMOVED_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-primary/60"
              >
                <span className="size-1 rounded-full bg-destructive/60 shrink-0" />
                {t(`Dialog.items.${item}`)}
              </li>
            ))}
          </ul>
        </div>

        <AlertDialogFooter className="m-0 p-0 pt-1 border-none bg-transparent grid! grid-cols-2 gap-3">
          <AlertDialogCancel className="h-10 rounded-sm border-secondary bg-transparent font-normal text-primary/70 hover:bg-transparent hover:text-primary">
            {t("Dialog.cancel")}
          </AlertDialogCancel>

          <Button
            type="button"
            disabled={isSendingCode}
            onClick={sendCode}
            className="h-10 rounded-sm border border-destructive/20 bg-destructive/10 font-normal text-destructive hover:bg-destructive/15"
          >
            {isSendingCode && <Spinner />}
            {t("Dialog.continue")}
          </Button>
        </AlertDialogFooter>
      </>
    );
  }

  const isBusy = isSubmitting || isSendingCode;

  return (
    <>
      <AlertDialogHeader className="flex! flex-row items-center gap-3 text-start">
        <AlertDialogMedia className="mb-0 size-9 shrink-0 rounded-full bg-destructive/10">
          <ShieldAlert className="size-4! text-destructive" />
        </AlertDialogMedia>
        <AlertDialogTitle className="font-normal text-lg text-primary ltr:font-lora">
          {t("Dialog.Confirm.title")}
        </AlertDialogTitle>
      </AlertDialogHeader>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AlertDialogDescription className="text-sm text-primary/60 leading-relaxed text-start">
          {t("Dialog.Confirm.description")}
        </AlertDialogDescription>

        <div className="space-y-2">
          <p className="text-primary/60 text-xs">
            {t("Dialog.Confirm.reasonLabel")}
          </p>

          <Controller
            control={control}
            name="reason"
            render={({ field }) => (
              <RadioGroup
                value={field.value ?? ""}
                onValueChange={field.onChange}
                disabled={isSubmitting}
                className="gap-2"
              >
                {reasons.map((reason) => (
                  <label
                    key={reason.value}
                    className={cn(
                      "flex items-center gap-3 rounded-sm border px-3 py-2.5 text-sm cursor-pointer transition-colors",
                      field.value === reason.value
                        ? "border-destructive/40 bg-destructive/5 text-primary"
                        : "border-secondary text-primary/70 hover:border-primary/20",
                    )}
                  >
                    <RadioGroupItem value={reason.value} />
                    {reason.label}
                  </label>
                ))}
              </RadioGroup>
            )}
          />

          <FieldError errors={[errors.reason]} />

          {isOther && (
            <>
              <Textarea
                {...register("reason_text")}
                aria-label={t("Dialog.Confirm.reasonTextLabel")}
                aria-invalid={!!errors.reason_text}
                placeholder={t("Dialog.Confirm.reasonTextPlaceholder")}
                maxLength={REASON_TEXT_MAX}
                disabled={isSubmitting}
                className="min-h-20 rounded-sm border-secondary text-sm"
              />
              <FieldError errors={[errors.reason_text]} />
            </>
          )}
        </div>

        <div className="space-y-1.5">
          <FormInput
            register={register}
            name="code"
            inputMode="numeric"
            required
            errors={errors}
            label={t("Dialog.Confirm.codeLabel")}
            placeholder={t("Dialog.Confirm.codePlaceholder")}
            labelClassName="text-primary/60 text-xs font-normal"
            inputClassName="border border-secondary"
            autoComplete="one-time-code"
            disabled={isSubmitting}
          />

          <button
            type="button"
            onClick={sendCode}
            disabled={isBusy || secondsLeft > 0}
            className="text-xs text-primary/60 hover:text-primary hover:underline disabled:opacity-50 cursor-pointer"
          >
            {secondsLeft > 0
              ? t("Dialog.Confirm.resendIn", {
                  count: secondsLeft,
                  seconds: format.number(secondsLeft),
                })
              : t("Dialog.Confirm.resend")}
          </button>
        </div>

        <AlertDialogFooter className="m-0 p-0 pt-1 border-none bg-transparent grid! grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={() => setStep("warning")}
            className="h-10 rounded-sm border-secondary bg-transparent font-normal text-primary/70 hover:bg-transparent hover:text-primary"
          >
            {t("Dialog.Confirm.back")}
          </Button>

          <Button
            type="submit"
            disabled={isBusy}
            className="h-10 rounded-sm bg-destructive font-normal text-white hover:bg-destructive/90"
          >
            {isSubmitting && <Spinner />}
            {t("Dialog.Confirm.delete")}
          </Button>
        </AlertDialogFooter>
      </form>
    </>
  );
}
