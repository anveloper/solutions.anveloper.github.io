import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

const getHref = (basePath: string, page: number) => (page === 1 ? basePath || "/" : `${basePath}/${page}`);

const getPageNumbers = (current: number, total: number): (number | "...")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current <= 4) {
    pages.push(2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push("...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push("...", current - 1, current, current + 1, "...", total);
  }

  return pages;
};

export const Pagination = ({ currentPage, totalPages, basePath }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="페이지네이션" className="flex items-center justify-center gap-1 mt-12">
      {currentPage === 1 ? (
        <span
          role="link"
          aria-disabled="true"
          aria-label="이전 페이지"
          className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground/40"
        >
          <ChevronLeft className="w-4 h-4" />
        </span>
      ) : (
        <Link
          href={getHref(basePath, currentPage - 1)}
          className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="이전 페이지"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden="true"
            className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getHref(basePath, page)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-md text-sm transition-colors",
              page === currentPage
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={`${page} 페이지`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage === totalPages ? (
        <span
          role="link"
          aria-disabled="true"
          aria-label="다음 페이지"
          className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground/40"
        >
          <ChevronRight className="w-4 h-4" />
        </span>
      ) : (
        <Link
          href={getHref(basePath, currentPage + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="다음 페이지"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  );
};
