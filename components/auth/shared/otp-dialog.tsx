import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

import { verifyOtp } from "@/lib/auth";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { OtpFormValues, otpSchema } from "@/types/otp";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

export default function OtpDialog({ place }: { place: string }) {
  const t = useTranslations("OTP");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    defaultValues: { code: "" },
    resolver: zodResolver(otpSchema(t)),
  });

  const onSubmit: SubmitHandler<OtpFormValues> = async (data) => {
    const result = await verifyOtp(data);

    if (result.success) {
      return;
    }

    if (result.errors) {
    }
  };

  return (
    <DialogContent className="sm:max-w-sm">
      <form
        className="flex flex-col items-center gap-4 text-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description", { place })}</DialogDescription>
        </DialogHeader>

        <Controller
          control={control}
          name="code"
          render={({ field }) => {
            return (
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            );
          }}
        />

        <FieldError errors={[errors.code]} />

        <div className="space-x-2">
          <Button
            type="submit"
            className="text-sm rounded-sm h-9 min-w-20"
            variant="default"
          >
            {isSubmitting ? <Spinner /> : t("send")}
          </Button>

          <Button
            type="button"
            className="text-sm rounded-sm h-9 min-w-20 bg-transparent text-secondary border-secondary/30"
            variant="outline"
          >
            {t("resend")}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
