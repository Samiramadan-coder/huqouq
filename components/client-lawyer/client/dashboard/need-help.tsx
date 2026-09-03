import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoveRight } from "lucide-react";
import { getLocale } from "next-intl/server";

export default async function NeedHelp() {
  const locale = await getLocale();
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div>
      <h3 className={`text-lg font-semibold text-primary mb-4 ${fontClass}`}>
        Need Help?
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 p-4 bg-white border border-secondary flex items-center gap-4">
          <div className="size-14 rounded-full bg-background" />
          <div className="flex-1 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xs text-accent tracking-[0.12em] uppercase mb-1">
                Upcoming Consultation
              </h3>
              <p
                className={`text-base font-semibold text-primary ${fontClass}`}
              >
                Ahmad Al Rashidi
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 font-sans text-xs text-primary/45">
                  <Calendar className="size-4" />
                  Thursday, 3 July 2025
                </span>
                <span className="flex items-center gap-1 font-sans text-xs text-primary/45">
                  <Clock className="size-4" />
                  11:00 AM
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-secondary text-primary bg-transparent font-normal rounded-sm h-10 px-6"
            >
              View Details
              <MoveRight className="rtl:rotate-180" />
            </Button>
          </div>
        </div>

        <div className="p-4 bg-white border border-secondary">
          <p
            className={`text-base font-semibold text-primary mb-1.5 ${fontClass}`}
          >
            Book a Consultation
          </p>
          <p className="text-sm text-primary/50 mb-4 leading-relaxed">
            Schedule time with a lawyer of your choice.
          </p>
          <Button
            variant="outline"
            className="border-secondary text-primary bg-transparent font-normal rounded-sm h-10 px-6"
          >
            Browse Lawyers
            <MoveRight className="rtl:rotate-180" />
          </Button>
        </div>

        <div className="p-4 bg-white border border-secondary">
          <p
            className={`text-base font-semibold text-primary mb-1.5 ${fontClass}`}
          >
            Emergency Legal Help
          </p>
          <p className="text-sm text-primary/50 mb-4 leading-relaxed">
            Need urgent help? Connect with an available lawyer now.
          </p>
          <Button
            variant="outline"
            className="border-destructive/20 text-destructive bg-transparent font-normal rounded-sm h-10 px-6"
          >
            Request Now
            <MoveRight className="rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
