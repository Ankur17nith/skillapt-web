import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { searchSkillsWithFuse } from "../lib/search";

interface PaletteItem {
  label: string;
  path: string;
  type: "skill" | "page";
}

const defaultNavItems: PaletteItem[] = [
  { label: "Browse all skills", path: "/browse", type: "page" },
  { label: "Browse categories", path: "/categories", type: "page" },
  { label: "Curated collections", path: "/collections", type: "page" },
  { label: "pdf-summarizer", path: "/skills/pdf-summarizer", type: "skill" },
  { label: "Submit a skill", path: "/submit", type: "page" },
  { label: "Documentation", path: "/docs", type: "page" },
  { label: "Security", path: "/security", type: "page" },
  { label: "Brand assets", path: "/brand", type: "page" },
];

export function CommandPalette({ close }: { close: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const matchedSkills = query.trim() ? searchSkillsWithFuse(query) : [];

  const items: PaletteItem[] = query.trim()
    ? [
        ...matchedSkills.slice(0, 5).map((s) => ({
          label: s.name,
          path: `/skills/${s.slug}`,
          type: "skill" as const,
        })),
        ...defaultNavItems.filter((i) =>
          i.label.toLowerCase().includes(query.toLowerCase())
        ),
      ]
    : defaultNavItems;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Focus trap and keyboard controls
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (items.length > 0 ? (prev + 1) % items.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        items.length > 0 ? (prev - 1 + items.length) % items.length : 0
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (items[selectedIndex]) {
        navigate(items[selectedIndex].path);
        close();
      }
      return;
    }
    if (e.key === "Tab") {
      // Focus trap within dialog
      if (dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
  };

  return (
    <div className="palette-backdrop" onClick={close} onKeyDown={handleKeyDown}>
      <div
        ref={dialogRef}
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette-search">
          <Icon name="search" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skillapt..."
            aria-label="Search skillapt commands and skills"
          />
          <kbd>ESC</kbd>
        </div>
        {items.length === 0 ? (
          <div style={{ padding: "16px", color: "var(--muted)", fontSize: "13px" }}>
            No results found.
          </div>
        ) : (
          items.map((item, idx) => (
            <button
              key={`${item.path}-${idx}`}
              className={selectedIndex === idx ? "selected" : ""}
              onClick={() => {
                navigate(item.path);
                close();
              }}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <Icon name={item.type === "skill" ? "package" : "arrow"} />
              {item.label}
              <span>Open</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
