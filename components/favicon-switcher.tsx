"use client";

import { useEffect } from "react";

type Theme = "light" | "dark" | "korean" | "terminal";

const FaviconSwitcher = () => {
  useEffect(() => {
    const setFavicon = (theme: Theme) => {
      const faviconHref = theme === "dark" || theme === "terminal" ? "/favicon-dark.svg" : "/favicon-light.svg";

      const rels = ["icon", "shortcut icon", "apple-touch-icon"];

      rels.forEach((rel) => {
        let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;

        if (!link) {
          link = document.createElement("link");
          link.rel = rel;
          link.type = "image/svg+xml";
          document.head.appendChild(link);
        }

        link.href = faviconHref;
      });
    };

    const getActiveTheme = (): Theme => {
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved === "dark" || saved === "light" || saved === "korean" || saved === "terminal") return saved;
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      return media.matches ? "dark" : "light";
    };

    setFavicon(getActiveTheme());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const saved = localStorage.getItem("theme");
      if (!saved) {
        setFavicon(media.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", handler);

    return () => {
      media.removeEventListener("change", handler);
    };
  }, []);

  return null;
};

export default FaviconSwitcher;
