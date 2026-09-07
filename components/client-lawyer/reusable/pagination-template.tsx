"use client";

import {
  Pagination,
  PaginationItem,
  PaginationLink,
  // PaginationNext,
  PaginationContent,
  PaginationEllipsis,
  // PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";
// import { useTranslations } from "next-intl";

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ] as const;
}

export default function PaginationTemplate({
  currentPage,
  totalPages,
  pageLabel = "page",
}: {
  currentPage: number;
  totalPages: number;
  pageLabel?: string;
}) {
  const [, setPage] = useQueryState(pageLabel, {
    history: "push",
    scroll: false,
    shallow: false,
  });

  // const t = useTranslations("Common");

  const visiblePages =
    currentPage && totalPages ? getVisiblePages(currentPage, totalPages) : [];

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        {/* <PaginationItem>
          <PaginationPrevious
            href="#"
            text={t("Previous")}
            aria-label={t("Previous")}
            onClick={(event) => {
              event.preventDefault();

              if (currentPage > 1) {
                void setPage((currentPage - 1).toString());
              }
            }}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem> */}

        {visiblePages.map((item) =>
          typeof item === "number" ? (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === currentPage}
                aria-label={`${item}`}
                onClick={(event) => {
                  event.preventDefault();
                  void setPage(item.toString());
                }}
                className={cn(
                  "cursor-pointer",
                  "data-[active=true]:bg-accent",
                  "data-[active=true]:text-white",
                  "data-[active=true]:hover:bg-accent",
                  "data-[active=true]:hover:text-white",
                  "data-[active=true]:border-accent",
                )}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}

        {/* <PaginationItem>
          <PaginationNext
            href="#"
            text={t("Next")}
            aria-label={t("Next")}
            onClick={(event) => {
              event.preventDefault();

              if (currentPage < totalPages) {
                void setPage((currentPage + 1).toString());
              }
            }}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem> */}
      </PaginationContent>
    </Pagination>
  );
}
