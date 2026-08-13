"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useServerInsertedHTML } from "next/navigation";

type Theme = "light" | "dark";

const STORAGE_KEY = "konga-theme";

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}")||"light";var r=document.documentElement;if(t==="dark")r.classList.add("dark");else r.classList.remove("dark");}catch(e){}})();`;

interface ThemeContextValue {
  theme?: Theme;
  resolvedTheme?: Theme;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme | undefined>(undefined);

  useServerInsertedHTML(() => (
    <script
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
      suppressHydrationWarning
    />
  ));

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial: Theme = stored === "dark" ? "dark" : "light";
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = useCallback((value: string) => {
    const next: Theme = value === "dark" ? "dark" : "light";
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: theme,
      setTheme,
    }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    return { setTheme: () => {} };
  }
  return context;
}
