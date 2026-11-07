import { Icon } from "./Icon";

export function Toast({
  title = "Copied to clipboard",
  message = "The install command is ready to paste.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <Icon name="check" />
      <div>
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
    </div>
  );
}
