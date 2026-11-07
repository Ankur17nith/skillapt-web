import type { ElementType, HTMLAttributes, ReactNode } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export function Container({
  as: Component = "div",
  children,
  className = "",
  ...props
}: ContainerProps) {
  return (
    <Component className={`container ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
