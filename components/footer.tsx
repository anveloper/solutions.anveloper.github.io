import Link from "next/link";

const links = [
  { label: "Blog", href: "https://anveloper.dev" },
  { label: "GitHub", href: "https://github.com/anveloper" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>© 2025 solutions.anveloper.dev</span>
        <nav aria-label="푸터 링크" className="flex items-center gap-3">
          {links.map((link, i) => (
            <span key={link.label} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden>·</span>}
              <Link
                href={link.href}
                className="hover:text-foreground transition-colors"
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
};
