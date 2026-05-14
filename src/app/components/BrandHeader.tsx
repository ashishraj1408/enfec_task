"use client";

import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

type BrandHeaderProps = {
  title?: string;
  action?: ReactNode;
  maxWidthClassName?: string;
};

export function BrandHeader({
  title,
  action,
  maxWidthClassName = "app-container",
}: BrandHeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    const preferredTheme =
      storedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(preferredTheme);
    document.documentElement.dataset.theme = preferredTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  return (
    <header className="app-header">
      <div
        className={`${maxWidthClassName} flex items-center justify-between gap-4 py-4`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="brand-logo" aria-hidden="true">
            <Image
              src="/enfeclogo.png"
              alt=""
              width={44}
              height={44}
              sizes="44px"
            />
          </span>
          <span className="truncate text-xl font-semibold tracking-normal text-gray-950">
            {title || "InterviewAI"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button
            type="button"
            onClick={toggleTheme}
           
            className="btn btn-quiet h-14 w-14 rounded-full p-0 border-4"
            aria-label="Toggle color mode"
          >
            {theme === "dark" ? (
              <Sun className="h-12 w-12" />
            ) : (
              <Moon className="h-12 w-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
