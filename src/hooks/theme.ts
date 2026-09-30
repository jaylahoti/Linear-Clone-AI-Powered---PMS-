import { useEffect, useState } from "react";
type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => applyTheme(theme), [theme]);

  return {
    theme,
    toggleTheme: () => setThemeState(t => (t === "dark" ? "light" : "dark")),
    setTheme: setThemeState,
  };
}