import { Icon } from "./Icon";
import type { Nav } from "../types";

export function CommandPalette({ close, nav }: { close: () => void; nav: Nav }) {
  const results = [
    ["Browse all skills", "/browse"],
    ["Browse categories", "/categories"],
    ["Curated collections", "/collections"],
    ["pdf-summarizer", "/skills/pdf-summarizer"],
    ["Submit a skill", "/submit"],
    ["Documentation", "/docs"],
    ["Security", "/security"],
    ["Brand assets", "/brand"],
  ];
  return (
    <div className="palette-backdrop" onClick={close}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette-search">
          <Icon name="search" />
          <input autoFocus placeholder="Search skillpm..." />
          <kbd>ESC</kbd>
        </div>
        {results.map(([label, path]) => (
          <button
            key={path}
            onClick={() => {
              nav(path);
              close();
            }}
          >
            <Icon name={path.includes("skills/") ? "package" : "arrow"} />
            {label}
            <span>Open</span>
          </button>
        ))}
      </div>
    </div>
  );
}
