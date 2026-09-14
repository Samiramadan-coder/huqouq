import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { ArrowUp, CheckCheck, Paperclip, ShieldCheck } from "lucide-react";

export default async function Messages() {
  const t = await getTranslations("Client.Messages");

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-secondary shrink-0">
        <Avatar className="size-9 shrink-0">
          <AvatarImage
            src="https://i.pravatar.cc/150?img=12"
            alt="Ahmad Al Rashidi"
          />
          <AvatarFallback className="bg-primary text-xs font-semibold text-white">
            A
          </AvatarFallback>
          <AvatarBadge className="bg-accent">
            <ShieldCheck />
          </AvatarBadge>
        </Avatar>

        <div className="flex-1">
          <p className="truncate text-sm font-semibold text-primary">
            Ahmad Al Rashidi
            <Badge className="ms-2 text-[10px] border-accent/40 bg-white text-accent">
              {t("Verified")}
            </Badge>
          </p>
          <span className="shrink-0 text-[11px] text-primary/50">
            Tenancy Agreement Review
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-4">-</div>

        <div className="px-5 py-4 space-y-3">
          <Card className="px-4 py-2.5 ring-0! border border-secondary rounded-xs flex-row items-center gap-4 justify-between">
            <p className="text-sm font-medium text-primary flex items-center gap-2">
              <CheckCheck className="text-accent size-3" />
              <span className="text-xs text-primary/70">{t("IsResolved")}</span>
            </p>
            <Button
              variant="outline"
              className="border-secondary text-accent text-[11px] bg-white font-medium rounded-sm"
            >
              {t("MarkAsComplete")}
            </Button>
          </Card>

          <InputGroup className="h-12 bg-white rounded-xs border-secondary">
            <InputGroupInput
              placeholder={t("WriteAMessage")}
              className="text-sm placeholder:text-primary/50 placeholder:text-xs"
            />

            <InputGroupAddon align="inline-end">
              <InputGroupButton type="button" size="icon-xs">
                <Paperclip className="text-primary/50" />
              </InputGroupButton>

              <InputGroupButton
                type="button"
                size="icon-sm"
                className="size-7 rounded-full bg-primary/40 text-white hover:bg-primary/60 disabled:opacity-100"
              >
                <ArrowUp />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
