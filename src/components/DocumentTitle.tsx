import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/": "Home",
  "/browse": "Browse skills",
  "/categories": "Categories",
  "/collections": "Collections",
  "/submit": "Submit a skill",
  "/docs": "Docs",
  "/security": "Security",
  "/about": "About",
  "/brand": "Brand",
};

export function DocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    let title = routeTitles[pathname];
    if (!title) {
      if (pathname.startsWith("/skills/")) {
        const slug = pathname.replace("/skills/", "");
        title = slug || "Skill details";
      } else if (pathname.startsWith("/docs")) {
        title = "Docs";
      } else {
        title = "Page not found";
      }
    }
    document.title = `${title} | skillpm`;
  }, [pathname]);

  return null;
}
