import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";
import Link from "next/link";

const platformLabel: Record<string, string> = {
  boj: "BOJ",
  programmers: "Programmers",
};

type Solution = {
  slug: string;
  frontmatter: Record<string, unknown>;
};

export const SolutionItems = ({ solutions }: { solutions: Solution[] }) => {
  if (solutions.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center">
        <Code className="w-8 h-8 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">아직 작성된 풀이가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {solutions.map((solution) => (
        <Link key={solution.slug} href={`/${solution.slug}`} className="block py-5 group">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-1">
            <time dateTime={(solution.frontmatter.date as string).replace(/\./g, "-")} className="text-sm text-muted-foreground shrink-0">{solution.frontmatter.date as string}</time>
            <h2 className="text-lg font-medium text-foreground group-hover:text-primary-sky transition-colors">
              {solution.frontmatter.title as string}
            </h2>
          </div>
          {typeof solution.frontmatter.description === "string" && (
            <p className="text-sm text-muted-foreground line-clamp-1 sm:ml-24">{solution.frontmatter.description}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-2 sm:ml-24">
            {typeof solution.frontmatter.platform === "string" && (
              <Badge variant="outline" className="text-xs">
                {platformLabel[solution.frontmatter.platform] ?? solution.frontmatter.platform}
              </Badge>
            )}
            {typeof solution.frontmatter.difficulty === "string" && (
              <Badge variant="outline" className="text-xs">
                {solution.frontmatter.difficulty}
              </Badge>
            )}
            {typeof solution.frontmatter.language === "string" && (
              <Badge variant="secondary" className="text-xs">
                {solution.frontmatter.language}
              </Badge>
            )}
            {Array.isArray(solution.frontmatter.tags) &&
              (solution.frontmatter.tags as string[]).slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
          </div>
        </Link>
      ))}
    </div>
  );
};
