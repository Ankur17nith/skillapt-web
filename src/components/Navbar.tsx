import { useState } from "react";
import { Icon } from "./Icon";
import { Link } from "./Link";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import type { Nav, Theme } from "../types";

export function Navbar({
  nav,
  theme,
  toggleTheme,
  openPalette,
}: {
  nav: Nav;
  theme: Theme;
  toggleTheme: () => void;
  openPalette: () => void;
}) {
  const [open, setOpen] = useState(false);
  const items = [
    ["Home", "/"],
    ["Discover", "/browse"],
    ["Categories", "/categories"],
    ["Collections", "/collections"],
    ["Publish", "/submit"],
    ["Documentation", "/docs"],
  ];
  return (
    <>
      <nav className="navbar">
        <Logo variant="full" nav={nav} />
        <div className="nav-links">
          {items.slice(1).map(([label, path]) => (
            <Link key={path} to={path} nav={nav}>
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <button className="nav-search" onClick={openPalette}>
            <Icon name="search" size={15} />
            Search <kbd>⌘K</kbd>
          </button>
          <a className="icon-button" href="https://github.com" aria-label="GitHub">
            <Icon name="github" />
          </a>
          <ThemeToggle theme={theme} toggle={toggleTheme} />
          <Button onClick={() => nav("/docs")}>Install CLI</Button>
        </div>
        <button className="mobile-menu-button" onClick={() => setOpen(true)}>
          <Icon name="menu" />
        </button>
      </nav>
      {open && (
        <div className="full-menu">
          <div>
            <Logo variant="mark" nav={nav} />
            <button onClick={() => setOpen(false)}>
              <Icon name="x" />
            </button>
          </div>
          {items.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              nav={(p) => {
                nav(p);
                setOpen(false);
              }}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </div>
      )}
    </>
  );
}
