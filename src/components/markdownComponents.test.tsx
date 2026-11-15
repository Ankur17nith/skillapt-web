// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ReactMarkdown from "react-markdown";
import { safeMarkdownComponents } from "./markdownComponents";

const md = (src: string) =>
  render(<ReactMarkdown components={safeMarkdownComponents}>{src}</ReactMarkdown>).container;

describe("safe markdown rendering", () => {
  it("adds noopener to external links and opens them in a new tab", () => {
    const a = md("[x](https://example.com)").querySelector("a")!;
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toContain("noopener");
    expect(a.getAttribute("rel")).toContain("noreferrer");
  });

  it("strips javascript: URLs", () => {
    const a = md("[x](javascript:alert(1))").querySelector("a");
    expect(a?.getAttribute("href") ?? "").not.toMatch(/^javascript:/i);
  });

  it("never renders raw HTML or scripts", () => {
    const c = md('<script>window.__pwned = 1</script><img src=x onerror="window.__pwned=1">hello');
    expect(c.querySelector("script")).toBeNull();
    expect(c.querySelector("img")).toBeNull();
    expect((window as unknown as { __pwned?: number }).__pwned).toBeUndefined();
  });

  it("only renders http(s) images, without referrer and lazily", () => {
    const img = md("![a](https://example.com/a.png)").querySelector("img")!;
    expect(img.getAttribute("referrerpolicy")).toBe("no-referrer");
    expect(img.getAttribute("loading")).toBe("lazy");
    expect(md("![a](data:image/svg+xml;base64,AAAA)").querySelector("img")).toBeNull();
  });
});
