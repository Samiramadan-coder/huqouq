import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { getLocale } from "next-intl/server";
import { Field } from "@/components/ui/field";

async function LawyersList() {
  return <div>Lawyers List</div>;
}

export default async function Page() {
  const locale = await getLocale();

  return (
    <main>
      <div className="container max-w-7xl py-20">
        <div>
          <h1
            className={cn("font-bold text-4xl mb-2", {
              "font-lora": locale === "en",
            })}
          >
            Find Your Lawyer
          </h1>

          <p className="text-base text-primary/70">
            Browse verified legal professionals across the UAE, filtered by
            specialization and location.
          </p>

          <Field className="mt-8">
            <InputGroup className="h-13 border-secondary bg-white">
              <InputGroupInput
                className="placeholder:text-primary/50 placeholder:text-base"
                placeholder="Search By name or Specialization...."
              />
              <InputGroupAddon></InputGroupAddon>
              <InputGroupAddon align="inline-start">
                <Search className="size-5 text-secondary" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[0.2fr_0.8fr] gap-8 mt-8">
          <div>Filters</div>

          <Suspense>
            <LawyersList />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
