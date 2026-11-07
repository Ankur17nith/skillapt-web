import { useState, useTransition, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Icon } from "../components/Icon";
import { FilterSidebar } from "../components/FilterSidebar";
import { EmptyState } from "../components/EmptyState";
import { LoadingState } from "../components/LoadingState";
import { SkillListItem } from "../components/SkillListItem";
import { SkillCard } from "../components/SkillCard";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { Container } from "../components/Container";
import { getSkills, filterSkills, sortSkills } from "../lib/skills";

const ITEMS_PER_PAGE = 12;

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [sheet, setSheet] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");

  // Read URL params
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const compatibility = searchParams.get("compat") || "";
  const language = searchParams.get("language") || "";
  const verified = searchParams.get("verified") === "true";
  const sort = searchParams.get("sort") || "Recently updated";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Update URL helper
  const updateParams = (updates: Record<string, string | null>) => {
    startTransition(() => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "" || (key === "page" && val === "1")) {
          next.delete(key);
        } else {
          next.set(key, val);
        }
      });
      setSearchParams(next, { replace: true });
    });
  };

  const clear = () => {
    startTransition(() => {
      setSearchParams(new URLSearchParams(), { replace: true });
    });
  };

  const allSkills = useMemo(() => getSkills(), []);

  const results = useMemo(() => {
    const filtered = filterSkills(allSkills, {
      query,
      category,
      compat: compatibility,
      verified: verified || undefined,
      language,
    });
    return sortSkills(filtered, sort);
  }, [allSkills, query, category, compatibility, verified, language, sort]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(results.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pagedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const filterProps = {
    category,
    compatibility,
    language,
    setCategory: (val: string) => updateParams({ category: val, page: "1" }),
    setCompatibility: (val: string) => updateParams({ compat: val, page: "1" }),
    setLanguage: (val: string) => updateParams({ language: val, page: "1" }),
    clear,
  };

  return (
    <main className="page">
      <Container>
        <SEO title="Browse skills" description="Explore verified AI agent capabilities across categories." url="/browse" />
        <PageHeader title="Browse skills">
          <span>{allSkills.length} packages</span>
        </PageHeader>
      <div className="browse-tools">
        <label className="registry-search">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(e) => updateParams({ q: e.target.value, page: "1" })}
            placeholder="Search by name, function, or tag"
            aria-label="Search skills"
          />
        </label>
        <button
          className="filter-button"
          onClick={() => setSheet(true)}
          aria-label="Open filter menu"
        >
          <Icon name="filter" />
          Filters
        </button>
        <label className="select-wrap">
          Sort
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value, page: "1" })}
            aria-label="Sort skills"
          >
            <option>Recently updated</option>
            <option>A–Z</option>
            <option>Stars</option>
            <option>Installs</option>
          </select>
        </label>
      </div>
      <div className="browse-layout">
        <FilterSidebar {...filterProps} />
        <div className="results">
          <div className="results-bar">
            <span>{results.length} results</span>
            <div className="view-toggle">
              <button
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                List
              </button>
              <button
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                Grid
              </button>
            </div>
          </div>
          {(category || compatibility || language || query) && (
            <div className="active-filters">
              {query && (
                <span>
                  "{query}"
                  <button onClick={() => updateParams({ q: null, page: "1" })} aria-label="Remove search query">
                    <Icon name="x" size={13} />
                  </button>
                </span>
              )}
              {category && (
                <span>
                  {category}
                  <button onClick={() => updateParams({ category: null, page: "1" })} aria-label="Remove category filter">
                    <Icon name="x" size={13} />
                  </button>
                </span>
              )}
              {compatibility && (
                <span>
                  {compatibility}
                  <button onClick={() => updateParams({ compat: null, page: "1" })} aria-label="Remove compatibility filter">
                    <Icon name="x" size={13} />
                  </button>
                </span>
              )}
              {language && (
                <span>
                  {language}
                  <button onClick={() => updateParams({ language: null, page: "1" })} aria-label="Remove language filter">
                    <Icon name="x" size={13} />
                  </button>
                </span>
              )}
            </div>
          )}
          {isPending ? (
            <LoadingState />
          ) : results.length === 0 ? (
            <EmptyState clear={clear} />
          ) : view === "list" ? (
            <div className="skill-list">
              {pagedResults.map((skill) => (
                <SkillListItem key={skill.slug || skill.name} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="card-grid">
              {pagedResults.map((skill) => (
                <SkillCard key={skill.slug || skill.name} skill={skill} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                disabled={currentPage <= 1}
                onClick={() => updateParams({ page: String(currentPage - 1) })}
                aria-label="Previous page"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={p === currentPage ? "active" : ""}
                  onClick={() => updateParams({ page: String(p) })}
                  aria-label={`Page ${p}`}
                  aria-current={p === currentPage ? "page" : undefined}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage >= totalPages}
                onClick={() => updateParams({ page: String(currentPage + 1) })}
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </div>
      {sheet && (
        <div className="sheet-backdrop" onClick={() => setSheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <FilterSidebar {...filterProps} close={() => setSheet(false)} />
            <Button onClick={() => setSheet(false)}>Show {results.length} packages</Button>
          </div>
        </div>
      )}
      </Container>
    </main>
  );
}
