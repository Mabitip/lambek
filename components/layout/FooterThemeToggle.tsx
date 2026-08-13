"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function FooterThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center" aria-hidden />
    );
  }

  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex items-center gap-2 transition hover:text-secondary"
    >
      {isDark ? (
        <>
          <Sun className="h-3.5 w-3.5" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="h-3.5 w-3.5" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}
