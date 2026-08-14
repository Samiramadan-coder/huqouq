import Info from "@/components/client-lawyer/lawyer/dashboard/info";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { http } from "@/lib/http";
import { cn } from "@/lib/utils";
import { LawyerProfile } from "@/types/lawyer/dashboard";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { getLocale } from "next-intl/server";

export default async function DashboardPage() {
  const locale = await getLocale();
  const { data, ok } = await http.get<LawyerProfile>("/api/lawyer/profile");

  if (!ok) {
    throw new Error("Failed to fetch lawyer profile");
  }

  // console.log(data);
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
                "border-primary/10": section.is_complete,
                "border-amber-300/60": !section.is_complete,
              })}
            >
              <AccordionItem value={section.key}>
                <AccordionTrigger className="gap-20 p-5 hover:no-underline">
                  <div className="cursor-pointer flex flex-1 items-center justify-between gap-10">
                    <div className="flex items-center gap-4">
                      {section.is_complete ? (
                        <CircleCheck className="size-4 text-emerald-500" />
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
                      "border-primary/10": section.is_complete,
                      "border-amber-300/60": !section.is_complete,
                    })}
                  >
                    <div className="px-5 pt-5"></div>
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
