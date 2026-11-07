import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { Toast } from "./Toast";
import { ScrollToTop } from "./ScrollToTop";
import { DocumentTitle } from "./DocumentTitle";
import type { Theme } from "../types";

export function Layout({
  toast,
  setToast,
}: {
  toast: boolean;
  setToast: (val: boolean) => void;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const [palette, setPalette] = useState(false);

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
      <Outlet context={{ openPalette: () => setPalette(true) }} />
      <Footer />
      {palette && <CommandPalette close={() => setPalette(false)} />}
      {toast && <Toast />}
    </div>
  );
}
