import GithubSlugger from "github-slugger";

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function extractToc(rawMarkdown: string): TocItem[] {
  const slugger = new GithubSlugger();

  // fenced code block 제거 (```...``` 내부의 heading 무시)
  const withoutCodeBlocks = rawMarkdown.replace(/```[\s\S]*?```/g, "");

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];

  let match;
  while ((match = headingRegex.exec(withoutCodeBlocks)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    const id = slugger.slug(text);
    items.push({ id, text, level });
  }

  return items;
}
