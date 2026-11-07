import { Logo } from "./Logo";
import { Link } from "./Link";
import { Container } from "./Container";
import { CONFIG } from "../config";

export function Footer() {
  const groups = [
    [
      "Product",
      ["Discover", "/browse"],
      ["Categories", "/categories"],
      ["Collections", "/collections"],
    ],
    ["Developers", ["Publish", "/publish"], ["Documentation", "/docs"], ["Security", "/security"]],
    [
      "Project",
      ["About", "/about"],
      ["Brand assets", "/brand"],
      ["GitHub", CONFIG.GITHUB_URL],
    ],
  ] as const;
  return (
    <footer>
      <Container>
        <div className="footer-main">
          <div>
            <Logo variant="full" />
            <p>The open package manager for trusted AI agent skills.</p>
          </div>
          {groups.map(([title, ...items]) => (
            <div key={title}>
              <strong>{title}</strong>
              {items.map(([label, path]) =>
                path.startsWith("http") ? (
                  <a key={label} href={path} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                ) : (
                  <Link key={label} to={path}>
                    {label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 {CONFIG.NAME}. Open source.</span>
          <span>Built for reusable agent skills.</span>
        </div>
      </Container>
    </footer>
  );
}
