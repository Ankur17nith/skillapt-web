import type { Components } from "react-markdown";
import { isHttpUrl } from "../lib/safe";

/**
 * Shared react-markdown overrides. Raw HTML is never rendered (react-markdown
 * default) and unsafe URL schemes are stripped by its urlTransform; on top of
 * that, external links get rel=noopener and images never leak a referrer.
 */
export const safeMarkdownComponents: Components = {
  a({ href, children, node: _node, ...props }) {
    const external = isHttpUrl(href);
    return (
      <a
        {...props}
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer nofollow ugc" }
          : {})}
      >
        {children}
      </a>
    );
  },
  img({ src, alt, node: _node, ...props }) {
    if (!isHttpUrl(typeof src === "string" ? src : undefined)) return null;
    return (
      <img
        {...props}
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );
  },
};
