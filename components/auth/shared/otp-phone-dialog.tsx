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
import { verifyPhoneOtp } from "@/lib/auth";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";
import { useUser } from "@/providers/user-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { OtpFormValues, otpSchema } from "@/types/otp";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

export default function OtpPhoneDialog({ phone }: { phone: string }) {
  const router = useRouter();
  const { setUser } = useUser();
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
    const result = await verifyPhoneOtp(data, phone);

    if (result.success && result.user && result.token) {
      setUser(result.user);
      await saveToken(result.token);
      toast.success(t("LoginSuccess"));
      router.push("/");
      return;
    }

    if (result.success === false && result.message) {
      toast.error(result.message);
    }

    if (result.success === false && result.errors) {
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
        </div>
      </form>
    </DialogContent>
  );
}
