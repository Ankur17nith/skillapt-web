import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className="not-found">
      <Logo variant="mark" size={72} className="not-found-logo" linked={false} />
      <div className="terminal nf">
        <div className="terminal-title">
          <Logo variant="mark" size={14} linked={false} />
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
      <Button onClick={() => navigate("/")}>Go home</Button>
    </main>
  );
}
