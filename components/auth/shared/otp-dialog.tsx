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

import { toast } from "sonner";
import { saveToken } from "@/lib/cookies";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { resendOtp, verifyOtp } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { OtpFormValues, otpSchema } from "@/types/otp";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

export default function OtpDialog({ token }: { token: string }) {
  const router = useRouter();
  const t = useTranslations("OTP");

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    defaultValues: { code: "" },
    resolver: zodResolver(otpSchema(t)),
  });

  const onSubmit: SubmitHandler<OtpFormValues> = async (data) => {
    const result = await verifyOtp(data, token);

    if (result.success) {
      await saveToken(token);
      toast.success(t("LoginSuccess"));
      router.push("/");
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof OtpFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(t("OtpError"));
  };

  return (
    <DialogContent className="sm:max-w-sm">
      <form
        className="flex flex-col items-center gap-4 text-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", { place: "phone" })}
          </DialogDescription>
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
            onClick={async () => {
              const result = await resendOtp(token);

              if (result.success) {
                toast.success(t("ResendSuccess"));
                return;
              }

              toast.error(t("ResendError"));
            }}
          >
            {t("resend")}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
