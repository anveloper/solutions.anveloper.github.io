import { PageContainer } from "@/components/page-container";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type NotFoundViewProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export const NotFoundView = ({ icon: Icon, title, description, href, linkLabel }: NotFoundViewProps) => {
  return (
    <PageContainer>
      <div className="py-24 flex flex-col items-center text-center">
        <Icon className="w-12 h-12 text-muted-foreground mb-6" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground mb-8">{description}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{linkLabel}</span>
        </Link>
      </div>
    </PageContainer>
  );
};
