"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "korean" | "terminal";

const VALID_THEMES: Theme[] = ["light", "dark", "korean", "terminal"];
const THEME_CLASSES: Theme[] = ["light", "dark", "korean", "terminal"];

const isValidTheme = (value: string | null): value is Theme => VALID_THEMES.includes(value as Theme);

export const useThemeClass = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (isValidTheme(saved)) return saved;
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemPrefersDark ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    THEME_CLASSES.forEach((cls) => root.classList.remove(cls));
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
  };

  return { theme, setTheme };
};
