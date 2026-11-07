import { Icon } from "./Icon";

export function Toast() {
  return (
    <div className="toast">
      <Icon name="check" />
      <div>
        <strong>Copied to clipboard</strong>
        <span>The install command is ready to paste.</span>
      </div>
    </div>
  );
}
