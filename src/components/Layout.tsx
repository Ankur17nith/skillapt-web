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

export function Layout() {
  const [theme, setTheme] = useState<Theme>("light");
  const [palette, setPalette] = useState(false);
  const [toastData, setToastData] = useState<ToastData | null>(null);

  const notify = (
    title = "Copied to clipboard",
    message = "The install command is ready to paste."
  ) => {
    setToastData({ title, message });
    window.setTimeout(() => setToastData(null), 2000);
  };

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
        toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
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
