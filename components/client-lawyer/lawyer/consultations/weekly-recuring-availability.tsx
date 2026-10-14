import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Control, Controller } from "react-hook-form";
import { AvailabilitySettings } from "@/types/lawyer/consultations";
import { Switch } from "@/components/ui/switch";

type Props = {
  control: Control<AvailabilitySettings>;
};

export default function WeeklyRecuringAvailability({ control }: Props) {
  return (
    <Controller
      control={control}
      name="weekly_recurring_availability"
      render={({}) => {
        return (
          <Accordion
            type="single"
            collapsible
            defaultValue="monday"
            className="*:data-[slot=accordion-item]:border-secondary"
          >
            <AccordionItem value="monday">
              <AccordionTrigger className="flex items-center gap-2">
                <Switch />
                <p className="font-bold">Mon</p>
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>

            <AccordionItem value="tuesday">
              <AccordionTrigger className="flex items-center gap-2">
                <Switch />
                <p className="font-bold">Tue</p>
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>

            <AccordionItem value="wednesday">
              <AccordionTrigger className="flex items-center gap-2">
                <Switch />
                <p className="font-bold">Wed</p>
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>

            <AccordionItem value="thursday">
              <AccordionTrigger className="flex items-center gap-2">
                <Switch />
                <p className="font-bold">Thu</p>
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>

            <AccordionItem value="friday">
              <AccordionTrigger className="flex items-center gap-2">
                <Switch />
                <p className="font-bold">Fri</p>
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>

            <AccordionItem value="saturday">
              <AccordionTrigger className="flex items-center gap-2">
                <Switch />
                <p className="font-bold">Sat</p>
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>

            <AccordionItem value="sunday">
              <AccordionTrigger className="flex items-center gap-2">
                <Switch />
                <p className="font-bold">Sun</p>
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      }}
    />
  );
}
