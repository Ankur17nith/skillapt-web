import { Logo } from "./Logo";
import { Link } from "./Link";
import type { Nav } from "../types";

export function Footer({ nav }: { nav: Nav }) {
  const groups = [
    [
      "Product",
      ["Discover", "/browse"],
      ["Categories", "/categories"],
      ["Collections", "/collections"],
    ],
    ["Developers", ["Publish", "/submit"], ["Documentation", "/docs"], ["Security", "/security"]],
    ["Project", ["About", "/about"], ["Brand assets", "/brand"], ["GitHub", "https://github.com"]],
  ] as const;
  return (
    <footer>
      <div className="footer-main">
        <div>
          <Logo variant="full" nav={nav} />
          <p>The open package manager for trusted AI agent skills.</p>
        </div>
        {groups.map(([title, ...items]) => (
          <div key={title}>
            <strong>{title}</strong>
            {items.map(([label, path]) =>
              path.startsWith("http") ? (
                <a key={label} href={path}>
                  {label}
                </a>
              ) : (
                <Link key={label} to={path} nav={nav}>
                  {label}
                </Link>
              ),
            )}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2025 skillpm. Open source.</span>
        <span>Built for reusable agent skills.</span>
      </div>
    </footer>
  );
}
