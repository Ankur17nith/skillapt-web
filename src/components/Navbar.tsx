import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { Container } from "./Container";
import { CONFIG } from "../config";
import { useAuth } from "../lib/auth";
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
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const items = [
    ["Home", "/"],
    ["Discover", "/browse"],
    ["Categories", "/categories"],
    ["Collections", "/collections"],
    ["Publish", "/publish"],
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
              href={CONFIG.GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Icon name="github" />
            </a>
            <ThemeToggle theme={theme} toggle={toggleTheme} />
            {user ? (
              <div className="user-menu-wrap" ref={dropdownRef}>
                <button
                  className="user-menu-trigger"
                  onClick={() => setUserDropdown((prev) => !prev)}
                  aria-label="User menu"
                  aria-expanded={userDropdown}
                >
                  <img
                    src={user.avatarUrl || "https://avatars.githubusercontent.com/u/12345"}
                    alt={user.handle}
                    className="user-avatar"
                  />
                  <span>@{user.handle}</span>
                  <Icon name="chevron" size={12} />
                </button>
                {userDropdown && (
                  <div className="user-dropdown">
                    <NavLink
                      to="/dashboard"
                      onClick={() => setUserDropdown(false)}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/publish"
                      onClick={() => setUserDropdown(false)}
                    >
                      Publish a skill
                    </NavLink>
                    <div className="menu-divider" />
                    <button
                      onClick={async () => {
                        setUserDropdown(false);
                        await logout();
                        navigate("/");
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="ghost" onClick={login}>
                Sign in
              </Button>
            )}
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
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Dashboard (@{user.handle})
              </NavLink>
              <button
                style={{ textAlign: "left", fontSize: "20px", background: "none", border: 0, padding: 0, color: "var(--muted)", cursor: "pointer" }}
                onClick={async () => {
                  setOpen(false);
                  await logout();
                  navigate("/");
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              style={{ textAlign: "left", fontSize: "24px", background: "none", border: 0, padding: 0, color: "var(--accent)", cursor: "pointer" }}
              onClick={() => {
                setOpen(false);
                login();
              }}
            >
              Sign in with GitHub
            </button>
          )}
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </div>
      )}
    </>
  );
}
