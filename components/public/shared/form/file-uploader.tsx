"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileIcon, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

type FileValue = string | File | null;

type SingleFormFileUploaderProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  className?: string;
  accept?: string;
  description?: string;
};

export default function SingleFormFileUploader<T extends FieldValues>({
  name,
  control,
  label,
  required,
  className,
  accept = "*/*",
  description,
}: SingleFormFileUploaderProps<T>) {
  const t = useTranslations("Common");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = (field.value ?? null) as FileValue;

        const displayValue =
          typeof value === "string" ? value : isFile(value) ? value.name : null;

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            {label && (
              <FieldLabel
                className={cn(
                  "text-xs text-primary/50 uppercase tracking-widest font-semibold",
                  required &&
                    "after:ms-1 after:text-destructive after:content-['*']",
                )}
              >
                {label}
              </FieldLabel>
            )}

            <FieldContent>
              <div className="space-y-2">
                {displayValue ? (
                  <div className="flex bg-background min-h-11 items-center gap-3 border border-dashed border-secondary/30 px-3">
                    <FileIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span
                      className="min-w-0 flex-1 truncate text-sm"
                      title={displayValue}
                    >
                      {displayValue}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      onClick={() => {
                        field.onChange(null);

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-none min-h-25 w-full gap-2 border-2 border-dashed border-secondary/30 hover:bg-background px-3 text-sm text-primary/50"
                  >
                    <Plus className="size-4" />
                    {t("UploadFile")}
                  </Button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    field.onChange(file);
                    event.target.value = "";
                  }}
                />

                <FieldError errors={[fieldState.error]} />
              </div>
            </FieldContent>

            {description && (
              <FieldDescription className="text-[11px] text-primary/50">
                {description}
              </FieldDescription>
            )}
          </Field>
        );
      }}
    />
  );
}

function isFile(value: FileValue): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "size" in value &&
    "type" in value
  );
}
