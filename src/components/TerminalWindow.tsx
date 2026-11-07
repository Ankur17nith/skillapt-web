import { Logo } from "./Logo";

export function TerminalWindow() {
  return (
    <div className="terminal">
      <div className="terminal-title">
        <Logo variant="mark" size={14} />
        Terminal
      </div>
      <div className="terminal-body">
        <p>
          <span>$</span> skillpm install pdf-summarizer
        </p>
        <p className="muted">Resolving skill manifest...</p>
        <p className="muted">Verifying publisher signature...</p>
        <p className="muted">Checking requested permissions...</p>
        <p className="success">✓ Installed pdf-summarizer@2.4.1</p>
      </div>
    </div>
  );
}
