"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { sendToLawyer } from "@/lib/client/find-lawyer";

export default function AssignToLawyer({
  caseId,
  lawyerId,
}: {
  caseId: number;
  lawyerId: number;
}) {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Client.FindLawyer");

  async function handleAssignToLawyer() {
    setLoading(true);
    const result = await sendToLawyer(caseId, lawyerId);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      return;
    }

    if (result.message) {
      toast.error(result.message);
      return;
    }

    toast.error(t("assignToLawyerFailed"));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-white h-10 rounded bg-emerald-700 text-xs hover:bg-emerald-700/90 hover:text-white w-full"
        >
          {t("assign")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("confirmAssign")}</DialogTitle>
          <DialogDescription className="mt-3">
            {t("confirmAssignDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-white border-none">
          <Button
            onClick={handleAssignToLawyer}
            className="bg-emerald-700 text-white border-secondary hover:bg-emerald-700/90 rounded-sm h-11 flex-1"
          >
            {loading && <Spinner />}
            {t("yesDoAssign")}
          </Button>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-transparent border-secondary rounded-sm h-11 flex-1"
            >
              {t("cancel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
