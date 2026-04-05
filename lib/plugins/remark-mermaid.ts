import type { Root, Code } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, "code", (node: Code, index, parent) => {
      if (node.lang !== "mermaid" || index === undefined || !parent) return;

      const value = node.value.replace(/"/g, "&quot;");

      parent.children.splice(index, 1, {
        type: "mdxJsxFlowElement" as never,
        name: "Mermaid",
        attributes: [
          {
            type: "mdxJsxAttribute" as never,
            name: "chart",
            value,
          },
        ],
        children: [],
        data: { _mdxExplicitJsx: true },
      } as never);
    });
  };
}
