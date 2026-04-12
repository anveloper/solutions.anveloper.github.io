import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";

const directory = path.join(process.cwd(), "_solutions");

// "20260218-boj-1234" → "boj-1234"
function toSlug(filename: string): string {
  return path.basename(filename).replace(/\.mdx$/, "").replace(/^\d{8}-/, "");
}

async function listMdxFiles(): Promise<string[]> {
  const entries = await fs.readdir(directory, { recursive: true });
  return entries.filter((f): f is string => typeof f === "string" && f.endsWith(".mdx"));
}

export async function getAllSolutions() {
  const filenames = await listMdxFiles();
  const solutions = await Promise.all(
    filenames.map(async (filename) => {
      const content = await fs.readFile(path.join(directory, filename), "utf8");
      const { data } = matter(content);
      return { slug: toSlug(filename), frontmatter: data };
    })
  );
  return solutions.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export async function getSolutionBySlug(slug: string) {
  const filenames = await listMdxFiles();
  const filename = filenames.find((f) => toSlug(f) === slug);
  if (!filename) return null;
  const fileContents = await fs.readFile(path.join(directory, filename), "utf8");
  const { data, content } = matter(fileContents);
  return { frontmatter: data, content };
}
