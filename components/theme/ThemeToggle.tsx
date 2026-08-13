"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "header" | "headerTransparent";
}

export function ThemeToggle({ className, variant = "default" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={cn("header-glass-btn", className)}
      />
    );
  }

  const isDark = (theme ?? resolvedTheme) === "dark";

  const variantStyles = {
    default: "text-foreground hover:bg-muted/30",
    header: "text-foreground hover:text-primary",
    headerTransparent: "border-white/30 text-white hover:border-white hover:bg-white/10",
  };

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn("header-glass-btn", variantStyles[variant], className)}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
