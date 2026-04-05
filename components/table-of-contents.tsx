"use client";

import { useMemo } from "react";
import { useActiveHeading } from "@/hooks/use-active-heading";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/toc";

type TableOfContentsProps = {
  items: TocItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  const headingIds = useMemo(() => items.map((item) => item.id), [items]);
  const activeId = useActiveHeading(headingIds);

  if (items.length < 2) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      className="hidden xl:block fixed left-[calc(50%+29.5rem)] top-28 w-52 max-h-[calc(100vh-8rem)] overflow-y-auto"
      aria-label="목차"
    >
      <p className="text-sm font-semibold text-foreground mb-3">목차</p>
      <ul className="space-y-1.5 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={cn(
                "block text-[13px] leading-snug py-0.5 transition-colors",
                item.level === 3 ? "pl-6" : "pl-3",
                activeId === item.id
                  ? "text-primary-sky font-medium border-l-2 border-primary-sky -ml-px"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
