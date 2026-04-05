import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";

const directory = path.join(process.cwd(), "_solutions");

// "20260218-boj-1234" → "boj-1234"
function toSlug(filename: string): string {
  return filename.replace(/\.mdx$/, "").replace(/^\d{8}-/, "");
}

export async function getAllSolutions() {
  const filenames = await fs.readdir(directory);
  const solutions = await Promise.all(
    filenames
      .filter((f) => f.endsWith(".mdx"))
      .map(async (filename) => {
        const content = await fs.readFile(path.join(directory, filename), "utf8");
        const { data } = matter(content);
        return { slug: toSlug(filename), frontmatter: data };
      })
  );
  return solutions.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export async function getSolutionBySlug(slug: string) {
  const filenames = await fs.readdir(directory);
  const filename = filenames.find((f) => f.endsWith(".mdx") && toSlug(f) === slug);
  if (!filename) return null;
  const fileContents = await fs.readFile(path.join(directory, filename), "utf8");
  const { data, content } = matter(fileContents);
  return { frontmatter: data, content };
}
