"use client";

import {
  profilePhotoSchema,
  ProfilePhotoFormValues,
} from "@/types/client/settings";

import { toast } from "sonner";
import AreaButton from "./area-button";
import { ChangeEvent, useRef } from "react";
import { useTranslations } from "next-intl";
import { useUser } from "@/providers/user-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateProfilePhoto } from "@/lib/client/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePhoto() {
  const { user, setUser } = useUser();
  const t = useTranslations("Client.Settings");
  const inputFile = useRef<HTMLInputElement>(null);

  const {
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ProfilePhotoFormValues>({
    resolver: zodResolver(profilePhotoSchema(t)),
  });

  const onSubmit: SubmitHandler<ProfilePhotoFormValues> = async ({ photo }) => {
    const result = await updateProfilePhoto(photo);

    if (!result.result) {
      toast.error(t("Photo.failed"));
      return;
    }

    setUser(result.user);
    toast.success(result.message);
  };

  // Upload right after picking a file; validation runs before the request
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Allow re-selecting the same file after an error
    e.target.value = "";

    if (!file) return;

    clearErrors("photo");
    setValue("photo", file);
    handleSubmit(onSubmit)();
  };

  if (!user) return null;

  return (
    <div className="py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarImage src={user.photo_url ?? ""} alt={user.name} />
          <AvatarFallback className="uppercase">
            {user.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="text-[11px] text-primary/40 leading-snug">
            {t("Photo.hint")}
          </p>
          {errors.photo && (
            <p role="alert" className="text-[11px] text-destructive mt-0.5">
              {errors.photo.message}
            </p>
          )}
        </div>
      </div>

      <AreaButton
        label={t("Photo.change")}
        type="button"
        disabled={isSubmitting}
        onClick={() => inputFile.current?.click()}
      />

      <input
        ref={inputFile}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
