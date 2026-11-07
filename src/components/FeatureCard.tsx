import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function FeatureCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="feature-card">
      <Icon name="shield" />
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}
