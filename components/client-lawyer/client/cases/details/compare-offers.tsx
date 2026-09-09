import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import AcceptOffer from "./accept-offer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseOffer } from "@/types/client/cases";
import { ChartNoAxesColumn, ShieldCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Proposal from "./proposal-message";

export default async function CompareOffers({
  caseId,
  offers,
}: {
  offers: CaseOffer[];
  caseId: number;
}) {
  const locale = await getLocale();
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Client.Cases");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-secondary text-xs hover:bg-transparent hover:text-accent hover:border-accent/20"
        >
          <ChartNoAxesColumn /> {t("compareOffers")}
        </Button>
      </DialogTrigger>

      <DialogContent className="ring-0! lg:min-w-5xl">
        <DialogHeader>
          <DialogTitle className={`font-bold ${fontClass}`}>
            {t("compareOffers")}
          </DialogTitle>
          <DialogDescription className="text-xs text-primary/40">
            {t("compareOffersDescription")}
          </DialogDescription>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow className="border-secondary">
              <TableHead className="py-4">
                <p className="text-xs uppercase text-primary/40">
                  {t("lawyer")}
                </p>
              </TableHead>
              {offers.map((offer) => (
                <TableHead key={offer.id} className="py-4 min-w-70">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12">
                      <AvatarImage
                        src={offer.lawyer.photo_url}
                        alt={offer.lawyer.name}
                      />
                      <AvatarFallback>{offer.lawyer.name[0]}</AvatarFallback>
                      <AvatarBadge className="bg-accent">
                        <ShieldCheck />
                      </AvatarBadge>
                    </Avatar>
                    <div>
                      <h3 className={cn("text-base font-semibold", fontClass)}>
                        {offer.lawyer.name}
                      </h3>
                      <span className="text-accent font-semibold text-[11px] mt-1">
                        {t("verified")}
                      </span>
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow className="border-secondary">
              <TableCell className="py-4">
                <p className="text-xs uppercase text-primary/40">
                  {t("experience")}
                </p>
              </TableCell>
              {offers.map((offer) => (
                <TableCell key={offer.id} className="py-4">
                  <p className="text-base text-primary/70">
                    {offer.lawyer.years_of_experience} Years
                  </p>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="border-secondary">
              <TableCell className="py-4">
                <p className="text-xs uppercase text-primary/40">
                  {t("price")}
                </p>
              </TableCell>
              {offers.map((offer) => (
                <TableCell key={offer.id} className="py-4">
                  <p className={`text-lg font-bold text-accent ${fontClass}`}>
                    {tCommon("AED")} {offer.amount}
                  </p>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="border-secondary">
              <TableCell className="py-4">
                <p className="text-xs uppercase text-primary/40">
                  {t("estTimeline")}
                </p>
              </TableCell>
              {offers.map((offer) => (
                <TableCell key={offer.id} className="py-4">
                  <p className="text-base text-primary/70">
                    {offer.expected_timeline || "_"}
                  </p>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="border-secondary">
              <TableCell className="py-4">
                <p className="text-xs uppercase text-primary/40">
                  {t("proposal")}
                </p>
              </TableCell>

              {offers.map((offer) => (
                <TableCell
                  key={offer.id}
                  className="max-w-70 whitespace-normal wrap-break-word py-4 align-top"
                >
                  <Proposal message={offer.message || "_"} />
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="border-secondary">
              <TableCell className="py-4">
                <p className="text-xs uppercase text-primary/40">
                  {t("specializations")}
                </p>
              </TableCell>

              {offers.map((offer) => (
                <TableCell key={offer.id} className="py-4">
                  <div className="flex gap-1">
                    {offer.lawyer.specializations.map((spec) => (
                      <Badge
                        className="text-[10px] h-6 rounded-sm bg-accent/5 border-secondary text-primary/60"
                        key={spec}
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              ))}
            </TableRow>

            <TableRow className="border-secondary">
              <TableCell className="py-4">
                <p className="text-xs uppercase text-primary/40">
                  {t("actions")}
                </p>
              </TableCell>

              {offers.map((offer) => (
                <TableCell key={offer.id} className="py-4">
                  <AcceptOffer caseId={caseId} offer={offer} />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
