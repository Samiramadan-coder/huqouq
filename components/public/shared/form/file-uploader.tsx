"use client";

import * as React from "react";
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

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileIcon, Plus, X } from "lucide-react";

type FileItem = string | File;
type FileValue = FileItem | FileItem[] | null;

type SingleFormFileUploaderProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  className?: string;
  accept?: string;
  description?: string;
  uploadButtonClassName?: string;
  previewBlockClassName?: string;
  multiple?: boolean;
  // Display name for already-uploaded files, which are stored as URLs
  getFileLabel?: (url: string) => string;
};

export default function SingleFormFileUploader<T extends FieldValues>({
  name,
  control,
  label,
  required,
  className,
  accept = "*/*",
  description,
  uploadButtonClassName,
  previewBlockClassName,
  multiple = false,
  getFileLabel,
}: SingleFormFileUploaderProps<T>) {
  const t = useTranslations("Common");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const labelId = React.useId();
  const errorId = React.useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = (field.value ?? null) as FileValue;

        const displayValues: FileItem[] = Array.isArray(value)
          ? value
          : value
            ? [value]
            : [];

        const handleRemove = (index: number) => {
          if (multiple) {
            const newValue = displayValues.filter(
              (_, itemIndex) => itemIndex !== index,
            );

            field.onChange(newValue);
          } else {
            field.onChange(null);
          }

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        };

        const handleFileChange = (
          event: React.ChangeEvent<HTMLInputElement>,
        ) => {
          const files = event.target.files
            ? Array.from(event.target.files)
            : [];

          if (!files.length) {
            return;
          }

          if (multiple) {
            const existingFiles: FileItem[] = Array.isArray(value)
              ? value
              : value
                ? [value]
                : [];

            field.onChange([...existingFiles, ...files]);
          } else {
            field.onChange(files[0]);
          }

          // يسمح باختيار نفس الملف مرة أخرى
          event.target.value = "";
        };

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            {label && (
              <FieldLabel
                id={labelId}
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
                {displayValues.map((displayValue, index) => {
                  const fileName =
                    displayValue instanceof File
                      ? displayValue.name
                      : (getFileLabel?.(displayValue) ?? displayValue);

                  return (
                    <div
                      key={`${fileName}-${index}`}
                      className={cn(
                        "flex bg-background min-h-11 items-center gap-3 border border-dashed border-accent/30 px-3",
                        previewBlockClassName,
                      )}
                    >
                      <FileIcon
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />

                      <span
                        className="min-w-0 flex-1 truncate text-sm"
                        title={fileName}
                      >
                        {fileName}
                      </span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        aria-label={`${t("RemoveFile")}: ${fileName}`}
                        onClick={() => handleRemove(index)}
                      >
                        <X className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  );
                })}

                {/* زر رفع الملفات يظل ظاهرًا دائمًا */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  aria-describedby={
                    [label ? labelId : "", fieldState.error ? errorId : ""]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    "rounded-none min-h-25 w-full gap-2 border-2 border-dashed border-accent/30 hover:bg-background px-3 text-sm text-primary/50",
                    uploadButtonClassName,
                  )}
                >
                  <Plus className="size-4" aria-hidden="true" />
                  {t("UploadFile")}
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  className="hidden"
                  tabIndex={-1}
                  aria-hidden="true"
                  multiple={multiple}
                  onChange={handleFileChange}
                />

                <FieldError id={errorId} errors={[fieldState.error]} />
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
