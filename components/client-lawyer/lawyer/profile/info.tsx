"use client";

import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/user-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";

export default function Info() {
  const locale = useLocale();
  const { user } = useUser();
  const t = useTranslations("Lawyer.Profile");
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative rounded-full"
      >
        <Avatar className="size-23">
          <AvatarImage
            src={previewImage || user?.photo_url || ""}
            alt={user?.name || "User Avatar"}
          />
          <AvatarFallback className="bg-white uppercase">
            <span>{user?.name.slice(0, 2)}</span>
          </AvatarFallback>
        </Avatar>

        <div className="cursor-pointer absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="size-6 text-white" />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </button>

      <div>
        <h3
          className={cn(
            "text-lg font-semibold",
            locale === "en" && "font-lora",
          )}
        >
          {user?.first_name} {user?.last_name}
        </h3>
        <p className="text-xs text-primary/45 mt-0.5">{user?.email}</p>
        <Button
          onClick={() => inputRef.current?.click()}
          variant="link"
          className="p-0 text-xs text-accent"
        >
          {t("ChangePhoto")}
        </Button>
      </div>
    </div>
  );
}
