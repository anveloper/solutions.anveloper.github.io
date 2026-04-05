"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

let mermaidIdCounter = 0;

export function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    const decoded = chart.replace(/&quot;/g, '"');
    const id = `mermaid-${++mermaidIdCounter}`;

    const isDark = document.documentElement.classList.contains("dark");

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      fontFamily: "inherit",
    });

    mermaid.render(id, decoded).then(({ svg }) => setSvg(svg));

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const nowDark = document.documentElement.classList.contains("dark");
          mermaid.initialize({
            startOnLoad: false,
            theme: nowDark ? "dark" : "default",
            fontFamily: "inherit",
          });
          const rerenderId = `mermaid-${++mermaidIdCounter}`;
          mermaid.render(rerenderId, decoded).then(({ svg }) => setSvg(svg));
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [chart]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Mermaid 다이어그램"
      className="my-6 flex justify-center overflow-x-auto bg-card rounded-lg border border-border p-4 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
