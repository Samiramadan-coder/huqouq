"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

export default function BackBtn({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="group text-primary/55 px-0 py-0 hover:bg-transparent"
      onClick={() => router.back()}
    >
      <ArrowLeft className="size-3 rtl:rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5" />
      {children}
    </Button>
  );
}
