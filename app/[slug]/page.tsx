import { getAllSolutions, getSolutionBySlug } from "@/_solutions";
import { SolutionItems } from "@/components/solution-items";
import { GiscusComments } from "@/components/giscus-comments";
import { PageContainer } from "@/components/page-container";
import { Pagination } from "@/components/pagination";
import { TableOfContents } from "@/components/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { mdxComponents } from "@/lib/mdx-components";
import { mdxOptions } from "@/lib/mdx-options";
import { extractToc } from "@/lib/toc";
import { NotFoundView } from "@/components/not-found-view";
import { PostNavigation } from "@/components/post-navigation";
import { RecentPosts } from "@/components/recent-posts";
import { ArrowLeft, Code, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

const platformLabel: Record<string, string> = {
  boj: "BOJ",
  programmers: "Programmers",
};

const PAGE_SIZE = 30;

export async function generateStaticParams() {
  const solutions = await getAllSolutions();
  const totalPages = Math.ceil(solutions.length / PAGE_SIZE);
  return [
    ...solutions.map((s) => ({ slug: s.slug })),
    ...Array.from({ length: totalPages - 1 }, (_, i) => ({ slug: String(i + 2) })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  if (/^\d+$/.test(slug)) {
    return { title: `Solutions - ${slug}페이지` };
  }

  const solution = await getSolutionBySlug(slug);
  if (!solution) return {};

  const { title, description, tags } = solution.frontmatter;

  return {
    title,
    description,
    keywords: tags as string[] | undefined,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (/^\d+$/.test(slug)) {
    const page = Number(slug);
    const solutions = await getAllSolutions();
    const totalPages = Math.ceil(solutions.length / PAGE_SIZE);

    if (page < 2 || page > totalPages) {
      return (
        <NotFoundView
          icon={Code}
          title="풀이를 찾을 수 없습니다"
          description="요청하신 페이지가 존재하지 않습니다."
          href="/"
          linkLabel="풀이 목록으로 돌아가기"
        />
      );
    }

    const paged = solutions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
      <PageContainer>
        <header className="mb-10">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Solutions</h1>
          <p className="text-sm text-muted-foreground mt-1">알고리즘 문제 풀이</p>
        </header>

        <SolutionItems solutions={paged} />
        <Pagination currentPage={page} totalPages={totalPages} basePath="" />
      </PageContainer>
    );
  }

  const [solution, solutions] = await Promise.all([getSolutionBySlug(slug), getAllSolutions()]);

  if (!solution) {
    return (
      <NotFoundView
        icon={Code}
        title="풀이를 찾을 수 없습니다"
        description="요청하신 풀이가 존재하지 않거나 삭제되었습니다."
        href="/"
        linkLabel="풀이 목록으로 돌아가기"
      />
    );
  }

  const tocItems = extractToc(solution.content);
  const { frontmatter } = solution;

  return (
    <PageContainer>
      <TableOfContents items={tocItems} />
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>풀이 목록으로 돌아가기</span>
      </Link>

      <header className="border-b border-border pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{frontmatter.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="text-sm text-muted-foreground">{frontmatter.date}</span>
          {frontmatter.platform && (
            <Badge variant="outline">{platformLabel[frontmatter.platform as string] ?? frontmatter.platform}</Badge>
          )}
          {frontmatter.difficulty && <Badge variant="outline">{frontmatter.difficulty}</Badge>}
          {frontmatter.language && <Badge variant="secondary">{frontmatter.language}</Badge>}
        </div>

        {frontmatter.problem_url && (
          <Link
            href={frontmatter.problem_url as string}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary-sky hover:underline mb-4"
          >
            원본 문제 보기
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}

        {frontmatter.tags && (
          <div className="flex flex-wrap gap-2">
            {(frontmatter.tags as string[]).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXRemote source={solution.content} components={mdxComponents} options={mdxOptions} />
      </article>

      {(() => {
        const idx = solutions.findIndex((s) => s.slug === slug);
        const recent = solutions
          .filter((s) => s.slug !== slug)
          .slice(0, 5)
          .map((s) => ({ slug: s.slug, title: s.frontmatter.title as string, date: s.frontmatter.date as string }));
        const prev = solutions[idx + 1] ?? null;
        const next = solutions[idx - 1] ?? null;
        return (
          <>
            <RecentPosts items={recent} basePath="" />
            <PostNavigation
              prev={prev ? { slug: prev.slug, title: prev.frontmatter.title as string } : null}
              next={next ? { slug: next.slug, title: next.frontmatter.title as string } : null}
              basePath=""
            />
          </>
        );
      })()}

      <GiscusComments />
    </PageContainer>
  );
}
