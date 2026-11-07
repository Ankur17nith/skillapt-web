import { describe, it, expect, beforeEach } from "vitest";
import { api, ApiError, clearApiCache } from "./api";

describe("API Client & Fallback", () => {
  beforeEach(() => {
    clearApiCache();
  });

  it("fetches fallback skills with pagination", async () => {
    const res = await api.getSkills({ page: 1, limit: 5 });
    expect(res.skills.length).toBe(5);
    expect(res.pagination.page).toBe(1);
    expect(res.pagination.limit).toBe(5);
    expect(res.pagination.total).toBe(12);
    expect(res.pagination.totalPages).toBe(3);
    expect(res.skills[0]).toHaveProperty("name");
    expect(res.skills[0]).toHaveProperty("latestVersion");
    expect(res.skills[0]).toHaveProperty("owner");
  });

  it("filters skills by query", async () => {
    const res = await api.getSkills({ q: "pdf" });
    expect(res.skills.length).toBeGreaterThan(0);
    expect(res.skills.some((s) => s.name === "pdf-summarizer")).toBe(true);
  });

  it("filters skills by category and verified", async () => {
    const res = await api.getSkills({ category: "Documents", verified: true });
    expect(res.skills.every((s) => s.verified)).toBe(true);
  });

  it("fetches single skill detail", async () => {
    const detail = await api.getSkill("pdf-summarizer");
    expect(detail.name).toBe("pdf-summarizer");
    expect(detail.versions).toBeDefined();
    expect(detail.latestVersion).toBeDefined();
    expect(detail.readme).toContain("PDF Summarizer");
  });

  it("throws ApiError(404) for non-existent skill", async () => {
    await expect(api.getSkill("non-existent-xyz-123")).rejects.toThrow(ApiError);
    try {
      await api.getSkill("non-existent-xyz-123");
    } catch (err: any) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(404);
      expect(err.code).toBe("NOT_FOUND");
    }
  });

  it("fetches stats accurately", async () => {
    const stats = await api.getStats();
    expect(stats.totalSkills).toBe(12);
    expect(stats.totalDownloads).toBeGreaterThan(100000);
    expect(stats.totalAuthors).toBeGreaterThan(0);
  });

  it("manages tokens in fallback mode", async () => {
    const initialTokens = await api.getTokens();
    expect(Array.isArray(initialTokens)).toBe(true);

    const created = await api.createToken("test-cli");
    expect(created.name).toBe("test-cli");
    expect(created.token).toMatch(/^apt_live_[0-9a-f]{32}$/);
    expect(created.warning).toContain("Copy this token now");

    const withCreated = await api.getTokens();
    expect(withCreated.some((t) => t.id === created.id)).toBe(true);

    await api.revokeToken(created.id);
    const afterRevoke = await api.getTokens();
    expect(afterRevoke.some((t) => t.id === created.id)).toBe(false);
  });

  it("submits a report", async () => {
    const res = await api.submitReport({
      skillName: "pdf-summarizer",
      version: "1.2.0",
      reason: "malware",
      details: "Suspicious network connection reported",
    });
    expect(res.id).toBeDefined();
    expect(res.message).toContain("Report received");
  });

  it("yanks and unyanks versions", async () => {
    const yankRes = await api.yankVersion("pdf-summarizer", "1.2.0", "Security issue");
    expect(yankRes.yanked).toBe(true);

    const unyankRes = await api.unyankVersion("pdf-summarizer", "1.2.0");
    expect(unyankRes.yanked).toBe(false);
  });
});
