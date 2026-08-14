import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { getLocale } from "next-intl/server";
import { LawyerProfile } from "@/types/lawyer/dashboard";
import { Circle, CircleCheck, TriangleAlert } from "lucide-react";
import Info from "@/components/client-lawyer/lawyer/dashboard/info";
import Education from "@/components/client-lawyer/lawyer/dashboard/education";
import Experience from "@/components/client-lawyer/lawyer/dashboard/experience";
import LanguagesBio from "@/components/client-lawyer/lawyer/dashboard/languages-bio";
import BarCertificates from "@/components/client-lawyer/lawyer/dashboard/bar-certificates";
import ProfessionalInfo from "@/components/client-lawyer/lawyer/dashboard/professional-info";
import SpecializationServices from "@/components/client-lawyer/lawyer/dashboard/specialization-services";

export default async function DashboardPage() {
  const locale = await getLocale();
  const { data, ok } = await http.get<LawyerProfile>("/api/lawyer/profile", {
    next: { tags: ["lawyer-profile"] },
  });

  if (!ok) {
    throw new Error("Failed to fetch lawyer profile");
  }

  return (
    <div className="container max-w-3xl">
      <div className="py-8">
        <h1
          className={cn(
            "text-2xl font-semibold mb-7",
            locale === "en" && "font-lora",
          )}
        >
          My Profile
        </h1>
        <Info />

        <div className="mt-8 space-y-4">
          {data.sections.map((section) => (
            <Accordion
              key={section.key}
              type="multiple"
              className={cn("bg-white border", {
                "border-primary/10": !section.reason,
                "border-amber-300/60": !!section.reason,
              })}
            >
              <AccordionItem value={section.key}>
                <AccordionTrigger className="gap-20 p-5 hover:no-underline">
                  <div className="cursor-pointer flex flex-1 items-center justify-between gap-10">
                    <div className="flex items-center gap-4">
                      {section.is_complete ? (
                        <CircleCheck className="size-4 text-emerald-500" />
                      ) : !section.is_complete ? (
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
                      "border-primary/10": !section.reason,
                      "border-amber-300/60": !!section.reason,
                    })}
                  >
                    <div className="px-5 pt-5">
                      {section.key === "professional_info" && (
                        <ProfessionalInfo profile={data.profile} />
                      )}

                      {section.key === "specializations_services" && (
                        <SpecializationServices profile={data.profile} />
                      )}

                      {section.key === "languages_bio" && <LanguagesBio />}

                      {section.key === "education" && <Education />}

                      {section.key === "experience" && <Experience />}

                      {section.key === "bar_certificate" && <BarCertificates />}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
}
