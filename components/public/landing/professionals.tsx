import Link from "next/link";
import Image from "next/image";
import { Button } from "../../ui/button";
import * as motion from "motion/react-client";
import { getTranslations } from "next-intl/server";
import { MoveRight, ShieldCheck, Star } from "lucide-react";

const lawyers = [
  {
    id: 1,
    name: "Ahmad Al Rashidi",
    specialization: "Criminal Law",
    image: "/get-started-hero.png",
    reviews: 47,
    experience: 18,
  },
  {
    id: 2,
    name: "Lima Mansour",
    specialization: "Family Law",
    image: "/get-started-hero.png",
    reviews: 63,
    experience: 12,
  },
  {
    id: 3,
    name: "Rajesh Krishnan",
    specialization: "Commercial Law",
    image: "/get-started-hero.png",
    reviews: 31,
    experience: 22,
  },
  {
    id: 4,
    name: "Sara Al Zaabi",
    specialization: "Real Estate Law",
    image: "/get-started-hero.png",
    reviews: 54,
    experience: 9,
  },
];

export default async function Professionals() {
  const t = await getTranslations("Home.Professionals");

  return (
    <section className="bg-background py-24 lg:py-28">
      <div className="container max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-secondary">
              {t("Label")}
            </p>

            <h2 className="font-lora text-3xl font-semibold text-primary md:text-4xl">
              {t("Title")}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.5,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-sm border-primary/20 bg-transparent px-6 text-primary hover:bg-transparent"
            >
              <Link href="/lawyers">
                {t("BrowseAll")}

                <MoveRight size={15} className="ms-2 rtl:rotate-180" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {lawyers.map((lawyer, index) => (
            <motion.div
              key={lawyer.id}
              initial={{ opacity: 0, y: 22, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              <Link
                href={`/lawyers/${lawyer.id}`}
                className="group block h-full overflow-hidden rounded-sm border border-secondary/30 bg-white transition-colors hover:border-secondary"
              >
                <div className="relative aspect-[1.27/1] overflow-hidden bg-background">
                  <Image
                    src={lawyer.image}
                    alt={lawyer.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />

                  <div className="absolute inset-e-3 top-3 flex items-center gap-1 rounded-sm bg-white/95 px-2 py-1 text-[10px] font-medium text-secondary">
                    <ShieldCheck size={11} />
                    {t("Verified")}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-colors group-hover:bg-primary/70">
                    <span className="translate-y-2 border border-white px-5 py-2 text-sm text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      {t("ViewProfile")}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-lora text-[17px] font-semibold text-primary">
                    {lawyer.name}
                  </h3>

                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-secondary">
                    {lawyer.specialization}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={13}
                          className="fill-secondary text-secondary"
                        />
                      ))}

                      <span className="ms-1 text-xs text-muted-foreground">
                        ({lawyer.reviews})
                      </span>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {t("Years", {
                        count: lawyer.experience,
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
