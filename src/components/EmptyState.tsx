import { Icon } from "./Icon";
import { Button } from "./Button";

export function EmptyState({ clear }: { clear: () => void }) {
  return (
    <div className="empty-state">
      <Icon name="search" />
      <h2>No skills found</h2>
      <p>Try a broader search or remove a filter.</p>
      <Button variant="secondary" onClick={clear}>
        Clear filters
      </Button>
    </div>
  );
}
