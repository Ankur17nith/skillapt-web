import { Icon } from "./Icon";
import type { Theme } from "../types";

export function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
      <Icon name={theme === "light" ? "sun" : "moon"} size={16} />
    </button>
  );
}
