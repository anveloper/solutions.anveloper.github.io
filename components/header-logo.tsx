"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const logoTexts = ["solutions.anveloper.dev", "알고리즘 문제 풀이 모음 ☺️"] as const;

interface HeaderLogoProps {
  autoSwitch?: boolean;
  interval?: number;
  activeIndex?: number;
}

const HeaderLogo = ({ autoSwitch = true, interval = 3_000, activeIndex: controlledIndex }: HeaderLogoProps) => {
  const [internalIndex, setInternalIndex] = useState(0);

  useEffect(() => {
    if (!autoSwitch) return;
    const delay = internalIndex === 0 ? interval * 2 : interval;
    const timer = setTimeout(() => {
      setInternalIndex((prev) => (prev + 1) % logoTexts.length);
    }, delay);
    return () => clearTimeout(timer);
  }, [autoSwitch, interval, internalIndex]);

  const activeIndex = autoSwitch ? internalIndex : (controlledIndex ?? 0);

  return (
    <Link
      href="/"
      aria-label="solutions.anveloper.dev 홈"
      className="w-full flex flex-1 font-semibold text-foreground hover:text-primary-sky transition-colors"
    >
      <span className="w-full relative" aria-hidden="true">
        {logoTexts.map((text, textIdx) => {
          const chars = text.split("");
          const isActive = textIdx === activeIndex;
          return (
            <span key={text} className={textIdx === 0 ? "relative" : "absolute left-0 top-0"}>
              {chars.map((char, i) => (
                <span
                  key={`${textIdx}-${i}`}
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: `opacity 0.3s ease ${i * 0.07}s`,
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          );
        })}
      </span>
    </Link>
  );
};

export default HeaderLogo;
