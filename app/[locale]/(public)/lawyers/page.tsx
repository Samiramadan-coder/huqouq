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
import { Card, CardContent } from "@/components/ui/card";

async function LawyersList() {
  return (
    <Card>
      <CardContent className="min-h-100 flex items-center justify-center font-bold text-2xl text-primary/80 underline italic">
        Still Under Development....
      </CardContent>
    </Card>
  );
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
            <InputGroup className="h-13 border-accent bg-white">
              <InputGroupInput
                className="placeholder:text-primary/50 placeholder:text-base"
                placeholder="Search By name or Specialization...."
              />
              <InputGroupAddon></InputGroupAddon>
              <InputGroupAddon align="inline-start">
                <Search className="size-5 text-accent" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[0.2fr_0.8fr] gap-6 mt-8">
          <Card>
            <CardContent></CardContent>
          </Card>

          <Suspense>
            <LawyersList />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
