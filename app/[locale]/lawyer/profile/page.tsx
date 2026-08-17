import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { LawyerProfile } from "@/types/lawyer/profile";
import { getLocale, getTranslations } from "next-intl/server";
import { Circle, CircleCheck, TriangleAlert } from "lucide-react";
import Info from "@/components/client-lawyer/lawyer/profile/info";
import Education from "@/components/client-lawyer/lawyer/profile/education";
import Experience from "@/components/client-lawyer/lawyer/profile/experience";
import LanguagesBio from "@/components/client-lawyer/lawyer/profile/languages-bio";
import SendForReview from "@/components/client-lawyer/lawyer/profile/send-for-review";
import BarCertificate from "@/components/client-lawyer/lawyer/profile/bar-certificate";
import ProfessionalInfo from "@/components/client-lawyer/lawyer/profile/professional-info";
import SpecializationServices from "@/components/client-lawyer/lawyer/profile/specialization-services";
import { ChangesRequestedAlert } from "@/components/client-lawyer/lawyer/profile/change-requested-alert";

export default async function DashboardPage() {
  const locale = await getLocale();
  const t = await getTranslations("Lawyer.Profile");

  const { data, ok } = await http.get<LawyerProfile>("/api/lawyer/profile", {
    next: { tags: ["lawyer-profile"] },
  });

  if (!ok) {
    throw new Error("Failed to fetch lawyer profile");
  }

  const countSectionsNeedAttention = data.sections.filter(
    (section) => section.status === "flagged",
  ).length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="py-8">
        <h1
          className={cn(
            "text-2xl font-semibold mb-7",
            locale === "en" && "font-lora",
          )}
        >
          {t("MyProfile")}
        </h1>

        {countSectionsNeedAttention > 0 && (
          <ChangesRequestedAlert count={countSectionsNeedAttention} />
        )}

        <Info />

        <div className="mt-8 space-y-4">
          {data.sections.map((section) => (
            <Accordion
              key={section.key}
              type="multiple"
              defaultValue={section.status === "flagged" ? [section.key] : []}
              className={cn("bg-white border", {
                "border-primary/10": section.status === "pending",
                "border-green-300/60": section.status === "approved",
                "border-amber-300/60": section.status === "flagged",
              })}
            >
              <AccordionItem value={section.key}>
                <AccordionTrigger className="gap-5 sm:gap-20 p-5 hover:no-underline">
                  <div className="cursor-pointer flex flex-1 items-center justify-between gap-10">
                    <div className="flex items-center gap-4">
                      {section.status === "approved" ? (
                        <CircleCheck className="size-4 text-emerald-500" />
                      ) : section.status === "pending" ? (
                        <Circle className="size-4 text-primary/50" />
                      ) : (
                        <TriangleAlert className="size-4 text-amber-500" />
                      )}
                      <p className="font-medium">{section.label}</p>
                    </div>

                    <p className="text-primary/35 text-[11px]">
                      {section.weight}%
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className={cn("border-t", {
                      "border-primary/10": section.status === "pending",
                      "border-green-300/60": section.status === "approved",
                      "border-amber-300/60": section.status === "flagged",
                    })}
                  >
                    <div className="px-5 pt-5">
                      {section.reason && (
                        <div className="mb-4 p-4 bg-amber-50 flex items-start gap-2 border rounded-md border-amber-200">
                          <TriangleAlert className="size-4 text-amber-500" />
                          <p className="text-amber-700 text-xs">
                            {section.reason}
                          </p>
                        </div>
                      )}

                      {section.key === "professional_info" && (
                        <ProfessionalInfo lawyerProfile={data} />
                      )}

                      {section.key === "specializations_services" && (
                        <SpecializationServices lawyerProfile={data} />
                      )}

                      {section.key === "languages_bio" && (
                        <LanguagesBio lawyerProfile={data} />
                      )}

                      {section.key === "education" && (
                        <Education lawyerProfile={data} />
                      )}

                      {section.key === "experience" && (
                        <Experience lawyerProfile={data} />
                      )}

                      {section.key === "bar_certificate" && (
                        <BarCertificate lawyerProfile={data} />
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}

          {data.is_ready_to_submit && data.is_editable && <SendForReview />}
        </div>
      </div>
    </div>
  );
}
