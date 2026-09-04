import { FileText, MoveRight, Scale } from "lucide-react";
import { getLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";

export default async function LegalServices() {
  const locale = await getLocale();
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div>
      <h3 className={`text-lg font-semibold text-primary mb-4 ${fontClass}`}>
        Legal Services
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-accent/5 border border-accent/40">
          <div className="size-10 bg-accent/15 mb-3 grid place-content-center">
            <Scale className="size-4 text-accent" />
          </div>
          <p
            className={`text-base font-semibold text-primary mb-1.5 ${fontClass}`}
          >
            Request a Legal Service
          </p>
          <p className="text-sm text-primary/50 mb-4 leading-relaxed">
            Need a contract drafted, reviewed, or a legal notice sent?
          </p>
          <Button
            variant="ghost"
            className="text-accent bg-transparent hover:bg-transparent hover:text-accent font-normal h-10 px-0"
          >
            Request a service
            <MoveRight className="rtl:rotate-180" />
          </Button>
        </div>

        <div className="p-4 bg-white border border-secondary">
          <div className="flex gap-4">
            <div className="size-10 bg-background mb-3 grid place-content-center">
              <FileText className="size-4 text-primary" />
            </div>
            <div>
              <p
                className={`text-base font-semibold text-primary ${fontClass}`}
              >
                1
              </p>
              <p className="text-sm text-primary/50 mb-4 leading-relaxed">
                Active Request
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-secondary text-primary bg-transparent font-normal rounded-sm h-10 px-6"
          >
            View All
            <MoveRight className="rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
