"use client";

import { toast } from "sonner";
import Title from "../../reusable/title";
import { ChangeEvent, useRef } from "react";
import { Camera, User } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/user-provider";
import { useLocale, useTranslations } from "next-intl";
import { updateProfilePhoto } from "@/lib/client/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PersonalInfo() {
  const { user, setUser } = useUser();
  const locale = useLocale();
  const t = useTranslations("Client.Profile");
  const inputRef = useRef<HTMLInputElement>(null);
  const fontClass = locale === "en" ? "font-lora" : "";

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const result = await updateProfilePhoto(file);

    if (result.result) {
      setUser(result.user);
      toast.success(result.message);
      return;
    }

    toast.error(t("FailedToUpdateProfilePhoto"));
  };

  return (
    <>
      <div>
        <Title>{t("MyProfile")}</Title>
        <p className="text-sm text-primary/40 mt-1">{t("infoHint")}</p>
      </div>

      <div className="bg-[#FAF8F4] border border-secondary rounded-sm p-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="group relative rounded-full"
            >
              <Avatar className="size-23">
                <AvatarImage
                  src={user?.photo_url || ""}
                  alt={user?.name || "User Avatar"}
                />
                <AvatarFallback className="bg-white uppercase">
                  <span>{user?.name.slice(0, 2)}</span>
                </AvatarFallback>
              </Avatar>

              <div className="cursor-pointer absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-6 text-white" />
              </div>
            </button>

            <Button
              onClick={() => inputRef.current?.click()}
              variant="link"
              className="p-0 text-xs text-accent"
            >
              {t("ChangePhoto")}
            </Button>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>

          <div>
            <p
              className={cn(
                "text-xl font-semibold text-primary leading-snug",
                fontClass,
              )}
            >
              {user?.name}
            </p>
            <p className="text-sm text-primary/50 mt-1">{user?.email}</p>
            <p className="text-sm text-primary/50 mt-1">{user?.phone}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 bg-accent/10 border border-accent/25 px-2.5 py-1 rounded-sm">
              <User className="text-[#9a7530] size-3" />
              <span className="text-[11px] text-[#9a7530]">
                {t("MemberSince")} {formatDate(user?.created_at || "")}
              </span>
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-4 pt-4 border-t border-secondary flex items-center">
          <div className="flex-1 text-center border-e border-secondary">
            <p
              className={cn(
                "text-xl font-semibold text-primary leading-none",
                fontClass,
              )}
            >
              7
            </p>
            <p className="text-[11px] text-primary/40 mt-1 leading-tight">
              {t("CasesPosted")}
            </p>
          </div>
          <div className="flex-1 text-center border-e border-secondary">
            <p
              className={cn(
                "text-xl font-semibold text-primary leading-none",
                fontClass,
              )}
            >
              12
            </p>
            <p className="text-[11px] text-primary/40 mt-1 leading-tight">
              {t("ConsultationBooked")}
            </p>
          </div>
          <div className="flex-1 text-center">
            <p
              className={cn(
                "text-xl font-semibold text-primary leading-none",
                fontClass,
              )}
            >
              13
            </p>
            <p className="text-[11px] text-primary/40 mt-1 leading-tight">
              {t("FavoriteSaved")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
