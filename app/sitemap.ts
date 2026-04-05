import { getAllSolutions } from "@/_solutions";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://solutions.anveloper.dev";

const PAGE_SIZE = 30;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const solutions = await getAllSolutions();
  const totalPages = Math.ceil(solutions.length / PAGE_SIZE);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];

  const paginationPages: MetadataRoute.Sitemap = Array.from({ length: totalPages - 1 }, (_, i) => ({
    url: `${BASE_URL}/${i + 2}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const solutionPages: MetadataRoute.Sitemap = solutions.map((solution) => ({
    url: `${BASE_URL}/${solution.slug}`,
    lastModified: new Date(solution.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...paginationPages, ...solutionPages];
}
