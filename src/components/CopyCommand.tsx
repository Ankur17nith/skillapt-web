import { useState } from "react";
import { Icon } from "./Icon";

export function CopyCommand({ command, notify }: { command: string; notify: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(command);
    setCopied(true);
    notify();
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="copy-command">
      <code>
        <span>$</span> {command}
      </code>
      <button onClick={copy}>
        <Icon name={copied ? "check" : "copy"} size={15} />
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
