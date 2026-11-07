import { Icon } from "./Icon";

export function SearchBar({
  compact = false,
  openPalette,
}: {
  compact?: boolean;
  openPalette: () => void;
}) {
  return (
    <button className={`search-bar ${compact ? "compact" : ""}`} onClick={openPalette}>
      <Icon name="search" />
      <span>Search skills... try 'pdf'</span>
      <kbd>⌘ K</kbd>
    </button>
  );
}
