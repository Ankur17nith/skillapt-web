import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Icon } from "../components/Icon";
import { FilterSidebar } from "../components/FilterSidebar";
import { EmptyState } from "../components/EmptyState";
import { SkillListItem } from "../components/SkillListItem";
import { SkillCard } from "../components/SkillCard";
import { Button } from "../components/Button";
import { skills } from "../data/initialData";

export function BrowsePage() {
  const [sheet, setSheet] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [compatibility, setCompatibility] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("Recently updated");
  const [view, setView] = useState<"list" | "grid">("list");
  const clear = () => {
    setQuery("");
    setCategory("");
    setCompatibility("");
    setLanguage("");
  };
  const results = skills
    .filter(
      (skill) =>
        !query ||
        `${skill.name} ${skill.description} ${skill.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .filter(
      (skill) =>
        !category || skill.tags.some((tag) => tag.toLowerCase() === category.toLowerCase()),
    )
    .filter((skill) => !compatibility || skill.compatibility.includes(compatibility))
    .filter((skill) => !language || skill.language === language)
    .sort((a, b) =>
      sort === "A–Z" ? a.name.localeCompare(b.name) : skills.indexOf(a) - skills.indexOf(b),
    );
  const filterProps = {
    category,
    compatibility,
    language,
    setCategory,
    setCompatibility,
    setLanguage,
    clear,
  };
  return (
    <main className="shell page">
      <PageHeader title="Browse skills">
        <span>{results.length} packages</span>
      </PageHeader>
      <div className="browse-tools">
        <label className="registry-search">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, function, or tag"
          />
        </label>
        <button className="filter-button" onClick={() => setSheet(true)}>
          <Icon name="filter" />
          Filters
        </button>
        <label className="select-wrap">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Recently updated</option>
            <option>A–Z</option>
          </select>
        </label>
      </div>
      <div className="browse-layout">
        <FilterSidebar {...filterProps} />
        <div className="results">
          <div className="results-bar">
            <span>{results.length} results</span>
            <div className="view-toggle">
              <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
                List
              </button>
              <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>
                Grid
              </button>
            </div>
          </div>
          {(category || compatibility || language) && (
            <div className="active-filters">
              {[category, compatibility, language].filter(Boolean).map((value) => (
                <span key={value}>
                  {value}
                  <button
                    onClick={() =>
                      value === category
                        ? setCategory("")
                        : value === compatibility
                          ? setCompatibility("")
                          : setLanguage("")
                    }
                  >
                    <Icon name="x" size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}
          {results.length === 0 ? (
            <EmptyState clear={clear} />
          ) : view === "list" ? (
            <div className="skill-list">
              {results.map((skill) => (
                <SkillListItem key={skill.name} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="card-grid">
              {results.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
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
    </main>
  );
}
