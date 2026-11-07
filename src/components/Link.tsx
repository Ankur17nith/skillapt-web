import type { ReactNode } from "react";
import type { Nav } from "../types";

export function Link({
  to,
  nav,
  children,
  className = "",
  label,
}: {
  to: string;
  nav: Nav;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={to}
      className={className}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        nav(to);
      }}
    >
      {children}
    </a>
  );
}
