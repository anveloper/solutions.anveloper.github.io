import type { Options } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMermaid from "./plugins/remark-mermaid";

const prettyCodeOptions: Options = {
  theme: {
    dark: "github-dark",
    light: "github-light",
  },
  defaultLang: "plaintext",
};

export const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMermaid],
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions] as [typeof rehypePrettyCode, Options]],
  },
};
