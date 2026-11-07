import { useEffect, useState, type ReactNode } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CommandPalette } from "./components/CommandPalette";
import { Toast } from "./components/Toast";
import { HomePage } from "./pages/HomePage";
import { BrowsePage } from "./pages/BrowsePage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CollectionsPage } from "./pages/CollectionsPage";
import { SkillDetailPage } from "./pages/SkillDetailPage";
import { SubmitPage } from "./pages/SubmitPage";
import { DocsPage } from "./pages/DocsPage";
import { SecurityPage } from "./pages/SecurityPage";
import { AboutPage } from "./pages/AboutPage";
import { BrandPage } from "./pages/BrandPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import type { Nav, Theme } from "./types";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [theme, setTheme] = useState<Theme>("light");
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState(false);

  const nav: Nav = (next) => {
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const pop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", pop);
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette(true);
      }
      if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("keydown", key);
    };
  }, []);

  const notify = () => {
    setToast(true);
    window.setTimeout(() => setToast(false), 2000);
  };

  let page: ReactNode;
  if (path === "/") page = <HomePage nav={nav} openPalette={() => setPalette(true)} notify={notify} />;
  else if (path === "/browse") page = <BrowsePage nav={nav} openPalette={() => setPalette(true)} />;
  else if (path === "/categories") page = <CategoriesPage nav={nav} />;
  else if (path === "/collections") page = <CollectionsPage nav={nav} />;
  else if (path === "/skills/pdf-summarizer") page = <SkillDetailPage nav={nav} notify={notify} />;
  else if (path === "/submit") page = <SubmitPage />;
  else if (path === "/docs") page = <DocsPage nav={nav} />;
  else if (path === "/security") page = <SecurityPage nav={nav} />;
  else if (path === "/about") page = <AboutPage />;
  else if (path === "/brand") page = <BrandPage nav={nav} />;
  else page = <NotFoundPage nav={nav} />;

  const titles: Record<string, string> = {
    "/": "Home",
    "/browse": "Browse skills",
    "/categories": "Categories",
    "/collections": "Collections",
    "/skills/pdf-summarizer": "pdf-summarizer",
    "/submit": "Submit a skill",
    "/docs": "Docs",
    "/security": "Security",
    "/about": "About",
    "/brand": "Brand",
  };
  document.title = `${titles[path] ?? "Page not found"} | skillpm`;

  return (
    <div className="app" data-theme={theme}>
      <Navbar
        nav={nav}
        theme={theme}
        toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        openPalette={() => setPalette(true)}
      />
      {page}
      <Footer nav={nav} />
      {palette && <CommandPalette close={() => setPalette(false)} nav={nav} />}
      {toast && <Toast />}
    </div>
  );
}
