"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import dynamic from "next/dynamic";
import { PhoneCall } from "lucide-react";
import { useTranslations } from "next-intl";
import { CallType } from "./config";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// The Agora SDK touches browser APIs on import, so it must never render on the server.
const AgoraCall = dynamic(() => import("./agora-call"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-16">
      <Spinner className="size-6 text-accent" />
    </div>
  ),
});

export default function JoinCall({
  consultationId,
  callType,
  remoteName,
  remotePhoto,
  label,
}: {
  consultationId: number;
  callType: CallType;
  remoteName: string;
  remotePhoto?: string | null;
  label: string;
}) {
  const t = useTranslations("Call");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent font-normal rounded-sm">
          <PhoneCall />
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        // Only the Leave button ends the call, so tracks and the channel are always released.
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-3xl gap-0 p-0 rounded-sm ring-0!"
      >
        <DialogHeader className="p-6 border-b border-secondary">
          <DialogTitle className="ltr:font-lora text-sm font-semibold text-primary text-start">
            {t("title", { name: remoteName })}
          </DialogTitle>
          <DialogDescription className="text-xs text-primary/45 text-start">
            {callType === "video"
              ? t("videoDescription")
              : t("audioDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {open && (
            <AgoraCall
              consultationId={consultationId}
              callType={callType}
              remoteName={remoteName}
              remotePhoto={remotePhoto}
              onLeave={() => setOpen(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
