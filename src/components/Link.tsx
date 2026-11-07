import type { ReactNode } from "react";
import { Link as RouterLink, type LinkProps } from "react-router-dom";

export function Link({
  to,
  children,
  className = "",
  label,
  ...props
}: {
  to: string;
  children: ReactNode;
  className?: string;
  label?: string;
} & Omit<LinkProps, "to">) {
  return (
    <RouterLink to={to} className={className} aria-label={label} {...props}>
      {children}
    </RouterLink>
  );
}
