import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type PostNavigationProps = {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
  basePath: string;
};

export const PostNavigation = ({ prev, next, basePath }: PostNavigationProps) => {
  if (!prev && !next) return null;

  return (
    <nav aria-label="이전/다음 글 네비게이션" className="mt-12 border-t border-border pt-6 grid grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={`${basePath}/${prev.slug}`}
          className="group flex items-start gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs">이전 글</span>
            <p className="text-sm font-medium truncate">{prev.title}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`${basePath}/${next.slug}`}
          className="group flex items-start gap-2 text-muted-foreground hover:text-foreground transition-colors justify-end text-right"
        >
          <div className="min-w-0">
            <span className="text-xs">다음 글</span>
            <p className="text-sm font-medium truncate">{next.title}</p>
          </div>
          <ChevronRight className="w-5 h-5 mt-0.5 shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
};
