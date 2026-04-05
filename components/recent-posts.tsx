import Link from "next/link";

type RecentPostsProps = {
  items: { slug: string; title: string; date: string }[];
  basePath: string;
};

export const RecentPosts = ({ items, basePath }: RecentPostsProps) => {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="recent-posts-heading" className="mt-12 border-t border-border pt-6">
      <h2 id="recent-posts-heading" className="text-sm font-medium text-foreground mb-4">최근 글</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${basePath}/${item.slug}`}
              className="flex items-baseline gap-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <time dateTime={item.date.replace(/\./g, "-")} className="text-xs shrink-0 tabular-nums">{item.date}</time>
              <span className="text-sm truncate">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
