import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("live registry requests", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("VITE_REGISTRY_URL", "https://registry.example.test");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ skills: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends lowercase category ids and the registry's sort key", async () => {
    const { api } = await import("./api");
    await api.getSkills({ category: "Documents", sort: "recent", q: "pdf" });
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.pathname).toBe("/v1/skills");
    expect(url.searchParams.get("category")).toBe("documents");
    expect(url.searchParams.get("sort")).toBe("updated");
  });

  it("reads categories from the registry and falls back when it fails", async () => {
    const { api, clearApiCache } = await import("./api");
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ categories: [{ id: "security", label: "Security", description: "x", count: 4 }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(await api.getCategories()).toEqual([{ id: "security", label: "Security", description: "x", count: 4 }]);

    clearApiCache(); // responses are cached for 30s
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    const fallback = await api.getCategories();
    expect(fallback.length).toBeGreaterThanOrEqual(15);
  });

  it("claims a listing with a POST to the claim endpoint", async () => {
    const { api } = await import("./api");
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ name: "@a/b", claimStatus: "claimed" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    await api.claimSkill("@a/b");
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://registry.example.test/v1/skills/%40a%2Fb/claim");
    expect(init.method).toBe("POST");
  });
});
