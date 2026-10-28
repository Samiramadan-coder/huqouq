import { MessageSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AcceptedOffer, HiredLawyer } from "@/types/client/legal-services";
import { getFormatters } from "@/lib/format.server";
import { Button } from "@/components/ui/button";

// The hired lawyer with the agreed fee, the chat shortcut and the dispute link
export default async function HiredLawyerRow({
  offer,
  hiredLawyer,
  canOpenChat,
}: {
  offer: AcceptedOffer;
  hiredLawyer: HiredLawyer;
  canOpenChat: boolean;
}) {
  const t = await getTranslations("Client.LegalServices");
  const format = await getFormatters();

  return (
    <div className="px-5 py-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage src={hiredLawyer.photo_url} alt={hiredLawyer.name} />
          <AvatarFallback>{hiredLawyer.name?.[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-semibold text-primary">
            {hiredLawyer.name}
          </p>
          <p className="font-sans text-xs text-primary/40">
            {t("agreedFee")}: {format.money(offer.fee)}
          </p>
        </div>

        {canOpenChat && (
          <Button
            asChild
            className="bg-accent text-primary rounded-sm hover:bg-accent/80"
          >
            <a href="#service-chat">
              <MessageSquare aria-hidden="true" />
              {t("openChat")}
            </a>
          </Button>
        )}
      </div>

      <button className="self-start text-xs text-[#9B2C2C]/60 hover:text-[#9B2C2C] transition-colors duration-200 underline underline-offset-2">
        {t("openDispute")}
      </button>
    </div>
  );
}
