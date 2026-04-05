import type { MDXComponents } from "mdx/types";
import { createElement } from "react";
import { Mermaid } from "@/components/mermaid";

export const mdxComponents: MDXComponents = {
  Mermaid,
  h1: (props) =>
    createElement("h1", {
      ...props,
      className: "text-2xl md:text-4xl font-bold mt-10 mb-5 text-foreground",
    }),
  h2: (props) =>
    createElement("h2", {
      ...props,
      className: "text-xl md:text-3xl font-semibold mt-9 mb-4 text-foreground border-b border-border pb-2",
    }),
  h3: (props) =>
    createElement("h3", {
      ...props,
      className: "text-lg md:text-2xl font-semibold mt-8 mb-3 text-foreground",
    }),
  h4: (props) =>
    createElement("h4", {
      ...props,
      className: "text-base md:text-xl font-semibold mt-6 mb-3 text-foreground",
    }),
  p: (props) =>
    createElement("p", {
      ...props,
      className: "my-5 leading-7 text-foreground/90",
    }),
  a: (props) =>
    createElement("a", {
      ...props,
      className: "text-primary-sky underline underline-offset-4 hover:text-primary-sky/80 transition-colors",
      target: props.href?.startsWith("http") ? "_blank" : undefined,
      rel: props.href?.startsWith("http") ? "noopener noreferrer" : undefined,
    }),
  ul: (props) =>
    createElement("ul", {
      ...props,
      className: "my-5 ml-6 list-disc space-y-2",
    }),
  ol: (props) =>
    createElement("ol", {
      ...props,
      className: "my-5 ml-6 list-decimal space-y-2",
    }),
  li: (props) =>
    createElement("li", {
      ...props,
      className: "text-foreground/90 leading-7",
    }),
  blockquote: (props) =>
    createElement("blockquote", {
      ...props,
      className: "border-l-4 border-primary-sky pl-4 my-6 italic text-muted-foreground",
    }),
  figure: (props) => {
    const isCodeFigure = props["data-rehype-pretty-code-figure"] !== undefined;
    return createElement("figure", {
      ...props,
      className: isCodeFigure ? "not-prose my-6" : props.className,
    });
  },
  code: (props) => {
    if (props["data-theme"]) {
      return createElement("code", props);
    }
    return createElement("code", {
      ...props,
      className: "bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground",
    });
  },
  pre: (props) => {
    if (props["data-theme"]) {
      return createElement("pre", props);
    }
    return createElement("pre", {
      ...props,
      className: "bg-muted p-4 rounded-lg overflow-x-auto my-6 font-mono text-sm",
    });
  },
  hr: (props) =>
    createElement("hr", {
      ...props,
      className: "my-8 border-border",
    }),
  table: ({ children, ...props }) =>
    createElement(
      "div",
      { className: "my-8 overflow-x-auto bg-card rounded-lg border border-border", role: "region", "aria-label": "표", tabIndex: 0 },
      createElement("table", { ...props, className: "w-full border-collapse" }, children)
    ),
  thead: (props) =>
    createElement("thead", {
      ...props,
      className: "bg-muted",
    }),
  th: (props) =>
    createElement("th", {
      scope: "col",
      ...props,
      className: "border-b border-r border-border px-4 py-2 text-left font-semibold last:border-r-0",
    }),
  td: (props) =>
    createElement("td", {
      ...props,
      className: "border-b border-r border-border px-4 py-2 last:border-r-0 [tr:last-child_&]:border-b-0",
    }),
  img: (props) =>
    createElement("img", {
      ...props,
      alt: props.alt || "",
      className: "rounded-lg my-6 max-w-full h-auto",
    }),
  strong: (props) =>
    createElement("strong", {
      ...props,
      className: "font-semibold text-foreground",
    }),
  em: (props) =>
    createElement("em", {
      ...props,
      className: "italic",
    }),
};
