import { Icon } from "./Icon";

export function FilterSidebar({
  category,
  compatibility,
  language,
  setCategory,
  setCompatibility,
  setLanguage,
  clear,
  close,
}: {
  category: string;
  compatibility: string;
  language: string;
  setCategory: (value: string) => void;
  setCompatibility: (value: string) => void;
  setLanguage: (value: string) => void;
  clear: () => void;
  close?: () => void;
}) {
  return (
    <aside className="filters">
      <div className="filter-head">
        <strong>Filters</strong>
        <button onClick={clear}>Clear all</button>
        {close && (
          <button onClick={close}>
            <Icon name="x" />
          </button>
        )}
      </div>
      <fieldset>
        <legend>Category</legend>
        {["", "Coding", "Documents", "Data", "Research", "Security"].map((item) => (
          <label key={item || "all"}>
            <input
              type="radio"
              name="category"
              checked={category === item}
              onChange={() => setCategory(item)}
            />
            {item || "All categories"}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Compatibility</legend>
        {["", "Claude", "Cursor", "Codex"].map((item) => (
          <label key={item || "all"}>
            <input
              type="radio"
              name="compatibility"
              checked={compatibility === item}
              onChange={() => setCompatibility(item)}
            />
            {item || "Any agent"}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Language</legend>
        {["", "TypeScript", "Python", "Markdown"].map((item) => (
          <label key={item || "all"}>
            <input
              type="radio"
              name="language"
              checked={language === item}
              onChange={() => setLanguage(item)}
            />
            {item || "Any language"}
          </label>
        ))}
      </fieldset>
    </aside>
  );
}
