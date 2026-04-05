"use client";

import { type Theme, useThemeClass } from "@/hooks/use-theme-class";
import { cn } from "@/lib/utils";
import { Moon, Palette, SquareTerminal, Sun } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type ThemeOption = {
  value: Theme;
  label: string;
  icon: typeof Sun;
  className: string;
  style?: React.CSSProperties;
};

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "라이트",
    icon: Sun,
    className: "bg-[#f5f5f7] text-[#1a1a2e] border border-[#1a1a2e]/15 hover:bg-[#eaeaee]",
  },
  {
    value: "dark",
    label: "다크",
    icon: Moon,
    className: "bg-[#1e1e2e] text-[#e0e0f0] border border-[#e0e0f0]/15 hover:bg-[#2a2a3e]",
  },
  {
    value: "korean",
    label: "묵향",
    icon: Palette,
    className: "bg-[#e8dcc8] text-[#3d2b1f] border border-[#3d2b1f]/15 hover:bg-[#d4c4a8]",
  },
  {
    value: "terminal",
    label: "터미널",
    icon: SquareTerminal,
    className: "bg-[#0d0d0d] text-[#00ff41] border border-[#00ff41]/15 hover:bg-[#1a1a1a]",
    style: { textShadow: "0 0 5px rgba(0,255,65,0.4)" },
  },
];

const currentIcon = (theme: Theme) => {
  const option = themeOptions.find((o) => o.value === theme);
  return option?.icon ?? Sun;
};

export const ThemeSelector = () => {
  const { theme, setTheme } = useThemeClass();
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        const currentIdx = themeOptions.findIndex((o) => o.value === theme);
        setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
      }
      return next;
    });
  }, [theme]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % themeOptions.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + themeOptions.length) % themeOptions.length);
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(themeOptions.length - 1);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0) {
            setTheme(themeOptions[focusedIndex].value);
            setOpen(false);
          }
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
        case "Tab":
          setOpen(false);
          break;
      }
    },
    [open, focusedIndex, handleToggle, setTheme]
  );

  useEffect(() => {
    if (open && focusedIndex >= 0) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [open, focusedIndex]);

  const Icon = currentIcon(theme);

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <button
        onClick={handleToggle}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="테마 선택"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Icon className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="테마 목록"
          aria-activedescendant={focusedIndex >= 0 ? `theme-option-${themeOptions[focusedIndex].value}` : undefined}
          className={cn(
            "absolute right-1/2 translate-x-1/2 top-full mt-1 z-50",
            "flex flex-col items-center gap-1.5 p-2",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          {themeOptions.map((option, index) => {
            const OptionIcon = option.icon;
            const isActive = theme === option.value;
            return (
              <button
                key={option.value}
                id={`theme-option-${option.value}`}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                role="option"
                aria-selected={isActive}
                aria-label={option.label}
                title={option.label}
                tabIndex={focusedIndex === index ? 0 : -1}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-center p-2 rounded-full! shadow-md",
                  "transition-all duration-200 hover:scale-110",
                  option.className,
                  isActive && "ring-1.5 ring-current/50"
                )}
                style={option.style}
              >
                <OptionIcon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
