import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { Toast } from "./Toast";
import { ScrollToTop } from "./ScrollToTop";
import { DocumentTitle } from "./DocumentTitle";
import type { Theme } from "../types";

export interface ToastData {
  title: string;
  message: string;
}

const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const saved = (localStorage.getItem("skillapt-theme") || localStorage.getItem("skillpm-theme")) as Theme | null;
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  }
  return "light";
};

export function Layout() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [palette, setPalette] = useState(false);
  const [toastData, setToastData] = useState<ToastData | null>(null);

  const notify = (
    title = "Copied to clipboard",
    message = "The install command is ready to paste."
  ) => {
    setToastData({ title, message });
    window.setTimeout(() => setToastData(null), 2000);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    try {
      localStorage.setItem("skillapt-theme", nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
    } catch (e) {}
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("skillapt-theme") && !localStorage.getItem("skillpm-theme")) {
        const nextTheme: Theme = e.matches ? "dark" : "light";
        setTheme(nextTheme);
        document.documentElement.setAttribute("data-theme", nextTheme);
      }
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette(true);
      }
      if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  return (
    <div className="app" data-theme={theme}>
      <ScrollToTop />
      <DocumentTitle />
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        openPalette={() => setPalette(true)}
      />
      <Outlet
        context={{
          openPalette: () => setPalette(true),
          notify,
        }}
      />
      <Footer />
      {palette && <CommandPalette close={() => setPalette(false)} />}
      {toastData && <Toast title={toastData.title} message={toastData.message} />}
    </div>
  );
}
