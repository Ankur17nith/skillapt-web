import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { Container } from "./Container";
import type { Theme } from "../types";

export function Navbar({
  theme,
  toggleTheme,
  openPalette,
}: {
  theme: Theme;
  toggleTheme: () => void;
  openPalette: () => void;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
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
        <Container className="navbar-inner">
          <Logo variant="full" />
          <div className="nav-links">
            {items.slice(1).map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="nav-actions">
            <button className="nav-search" onClick={openPalette} aria-label="Search skills">
              <Icon name="search" size={15} />
              Search <kbd>⌘K</kbd>
            </button>
            <a
              className="icon-button"
              href="https://github.com/Ankur17nith/skillpm-web"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Icon name="github" />
            </a>
            <ThemeToggle theme={theme} toggle={toggleTheme} />
            <Button onClick={() => navigate("/docs")}>Install CLI</Button>
          </div>
          <button
            className="mobile-menu-button"
            onClick={() => setOpen(true)}
            aria-label="Open mobile menu"
          >
            <Icon name="menu" />
          </button>
        </Container>
      </nav>
      {open && (
        <div className="full-menu" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div>
            <Logo variant="mark" />
            <button onClick={() => setOpen(false)} aria-label="Close mobile menu">
              <Icon name="x" />
            </button>
          </div>
          {items.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          ))}
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </div>
      )}
    </>
  );
}
