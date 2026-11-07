import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import type { Nav } from "../types";

export function NotFoundPage({ nav }: { nav: Nav }) {
  return (
    <main className="not-found">
      <Logo variant="mark" size={72} className="not-found-logo" />
      <div className="terminal nf">
        <div className="terminal-title">
          <Logo variant="mark" size={14} />
          Terminal
        </div>
        <div className="terminal-body">
          <p>
            <span>$</span> skillpm open /missing-page
          </p>
          <p>skillpm: command not found</p>
        </div>
      </div>
      <h1>404</h1>
      <p>The page you requested does not exist.</p>
      <Button onClick={() => nav("/")}>Go home</Button>
    </main>
  );
}
