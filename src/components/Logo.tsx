import { Link } from "./Link";

export function Logo({
  variant = "full",
  size = 32,
  className = "",
  linked = true,
}: {
  variant?: "full" | "mark";
  size?: number;
  className?: string;
  linked?: boolean;
}) {
  const width = variant === "full" ? size * 4.15 : size;
  const artwork = (
    <svg
      className="logo-art"
      width={width}
      height={size}
      viewBox={variant === "full" ? "0 0 133 32" : "0 0 32 32"}
      role="img"
      aria-label="skillpm"
    >
      <rect x="5" y="4" width="22" height="6" rx="3" fill="currentColor" />
      <rect x="5" y="8" width="6" height="8" rx="3" fill="currentColor" />
      <rect x="5" y="13" width="22" height="6" rx="3" fill="currentColor" />
      <rect x="21" y="16" width="6" height="8" rx="3" fill="#4169E1" />
      <rect x="5" y="22" width="22" height="6" rx="3" fill="currentColor" />
      {variant === "full" && (
        <text
          x="42"
          y="24"
          fill="currentColor"
          fontFamily="Inter, sans-serif"
          fontSize="26"
          fontWeight="600"
          letterSpacing="-0.26"
        >
          skillpm
        </text>
      )}
    </svg>
  );
  return linked ? (
    <Link to="/" className={`logo ${className}`} label="skillpm home">
      {artwork}
    </Link>
  ) : (
    <span className={`logo ${className}`} aria-label="skillpm">
      {artwork}
    </span>
  );
}
