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

import { cn } from "cn";
import { toast } from "sonner";
import { http } from "@/lib/http";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { acceptServiceOffer } from "@/lib/client/legal-services";
import { Offer, PaymentDetails } from "@/types/client/legal-services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AcceptOffer({
  serviceId,
  offer,
  btnClassName,
}: {
  serviceId: number;
  offer: Offer;
  btnClassName?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Client.LegalServices");
  const [loading, setLoading] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const fontClass = locale === "en" ? "font-lora" : "";
  const [open, setOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null,
  );

  // Fetch payment details when the dialog opens
  useEffect(() => {
    if (!open) return;

    async function getPaymentDetails() {
      try {
        const { data } = await http.get<{ data: PaymentDetails }>(
          `/api/legal-services/${serviceId}/offers/${offer.id}/checkout`,
        );

        setPaymentDetails(data.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    }

    void getPaymentDetails();
  }, [open, serviceId, offer.id]);

  // Handle accept offer
  async function handleAcceptOffer() {
    setLoading(true);
    const result = await acceptServiceOffer({
      serviceId,
      offerId: offer.id,
      fee: paymentDetails?.total ?? 0,
    });
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      closeBtn.current?.click();
      return;
    }

    if (result.message) {
      toast.error(result.message);
      return;
    }

    toast.error(t("offerAcceptFailed"));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "text-xs font-semibold rounded-sm h-9 px-4",
            btnClassName,
          )}
        >
          {t("acceptOffer")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md ring-0!">
        <DialogHeader>
          <DialogTitle className={cn("font-bold", fontClass)}>
            {t("ConfirmHire")}
          </DialogTitle>
        </DialogHeader>

        {paymentDetails ? (
          <div className="space-y-6 mt-4">
            <div className="flex items-center gap-2">
              <Avatar className="size-10">
                <AvatarImage
                  src={offer.lawyer.photo_url}
                  alt={paymentDetails.lawyer_name}
                />
                <AvatarFallback>{paymentDetails.lawyer_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p
                  className={cn(
                    "text-sm text-primary font-semibold",
                    fontClass,
                  )}
                >
                  {paymentDetails.lawyer_name}
                </p>
                <p className="text-primary/70 mt-0.5 text-xs">
                  {paymentDetails.service_type_label}
                </p>
              </div>
            </div>

            <div className="bg-background rounded-sm px-4 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary/60">
                  {t("agreedFee")}
                </span>
                <span className="text-sm font-bold text-primary">
                  {paymentDetails.currency} {paymentDetails.fee}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-primary/45">
                  {t("huqouqPlatformFee")} ({paymentDetails.fee_percentage}%)
                </span>
                <span className="text-xs text-primary/45">
                  {paymentDetails.currency} {paymentDetails.platform_fee}
                </span>
              </div>
              <div className="h-px bg-[#EDE9E1]"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  {t("totalYouPay")}
                </span>
                <span className="text-base font-bold text-accent">
                  {paymentDetails.currency} {paymentDetails.total}
                </span>
              </div>
              <p className="text-[11px] text-primary/35 leading-relaxed">
                {t("lawyerAmount", {
                  amount: `${paymentDetails.currency} ${paymentDetails.lawyer_amount}`,
                })}
              </p>
            </div>
          </div>
        ) : (
          <Spinner />
        )}

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={handleAcceptOffer}
            className="bg-accent text-primary border-secondary hover:bg-accent rounded-sm h-11 flex-1"
          >
            {loading && <Spinner />}
            {t("continueToPayment")}
            <ArrowRight className="size-4 text-primary rtl:rotate-180" />
          </Button>
          <DialogClose asChild>
            <Button ref={closeBtn} className="hidden"></Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
