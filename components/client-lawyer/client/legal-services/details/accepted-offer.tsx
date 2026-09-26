import { Clock, MessageSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AcceptedOffer, HiredLawyer } from "@/types/client/legal-services";
import { Button } from "@/components/ui/button";

export default async function OfferAccepted({
  offer,
  hiredLawyer,
}: {
  offer: AcceptedOffer;
  hiredLawyer: HiredLawyer;
}) {
  const t = await getTranslations("Client.LegalServices");
  const tCommon = await getTranslations("Common");

  return (
    <div className="bg-white border border-secondary rounded-sm overflow-hidden">
      <div className="bg-[#EDF2F7] border-b border-[#bee3f8] px-5 py-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-primary shrink-0" />
        <div>
          <p className="text-sm font-semibold text-primary mb-0.5">
            {t("inProgress")}
          </p>
          <p className="text-xs text-primary/55 leading-relaxed">
            {t("inProgressMessage", {
              name: hiredLawyer.name,
            })}
          </p>
        </div>
      </div>

      <div className="px-5 py-4 flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage src={hiredLawyer.photo_url} alt={hiredLawyer.name} />
          <AvatarFallback>{hiredLawyer.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-semibold text-primary">
            {hiredLawyer.name}
          </p>
          <p className="font-sans text-xs text-primary/40">
            {t("agreedFee")}: {tCommon("AED")} {offer.fee}
          </p>
        </div>

        <Button className="bg-accent text-primary rounded-sm hover:bg-accent/80">
          <MessageSquare />
          {t("openChat")}
        </Button>
      </div>
    </div>
  );
}
