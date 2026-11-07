import rawSkills from "../data/registry.json";
import type { Skill } from "../types";

export interface ApiSkillOwner {
  handle: string;
  avatarUrl?: string;
}

export interface ApiSkillSummary {
  name: string;
  latestVersion: string;
  description: string;
  license: string;
  category: string;
  compatibility: string[];
  downloads: number;
  stars?: number;
  verified: boolean;
  owner: ApiSkillOwner;
  updatedAt: string;
}

export interface ApiSkillPermissions {
  network: boolean;
  shell: boolean;
  filesystem: "none" | "read" | "write" | "read-write";
}

export interface ApiSkillVersion {
  version: string;
  sha256: string;
  size: number;
  tarballUrl: string;
  dependencies: Record<string, string>;
  publishedAt: string;
  yanked: boolean;
  permissions: ApiSkillPermissions;
}

export interface ApiSkillDetail {
  name: string;
  description: string;
  license: string;
  repository?: string;
  keywords?: string[];
  category: string;
  compatibility: string[];
  owner: ApiSkillOwner;
  latestVersion: string;
  downloads: number;
  stars?: number;
  versions: Record<string, ApiSkillVersion>;
  readme?: string;
  createdAt?: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SkillsListResponse {
  skills: ApiSkillSummary[];
  pagination: Pagination;
}

export interface ApiUser {
  id: string;
  handle: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ApiToken {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface CreateTokenResponse {
  id: string;
  name: string;
  token: string;
  createdAt: string;
  warning: string;
}

export interface ApiStats {
  totalSkills: number;
  totalVersions: number;
  totalDownloads: number;
  totalAuthors: number;
}

export interface ReportPayload {
  skillName: string;
  version: string;
  reason: string;
  details: string;
}

export interface SkillsQueryParams {
  q?: string;
  category?: string;
  compat?: string;
  verified?: boolean;
  sort?: "downloads" | "recent" | "name" | string;
  page?: number;
  limit?: number;
}

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

// In-memory GET cache with 30s TTL
interface CacheEntry<T> {
  data: T;
  expiry: number;
}
const cache = new Map<string, CacheEntry<unknown>>();

export function clearApiCache() {
  cache.clear();
}

const DEFAULT_TIMEOUT_MS = 10000;

export function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (envUrl && envUrl.length > 0) {
    return envUrl.replace(/\/+$/, "");
  }
  return "";
}

export function isUsingLiveApi(): boolean {
  return getApiBaseUrl().length > 0;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const isGet = !options.method || options.method.toUpperCase() === "GET";
  if (isGet) {
    const cached = cache.get(url);
    if (cached && cached.expiry > Date.now()) {
      clearTimeout(timeoutId);
      return cached.data as T;
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.body && !(options.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let code = "UNKNOWN_ERROR";
      let message = `Request failed with status ${res.status}`;
      try {
        const errorBody = await res.json();
        if (errorBody?.error) {
          code = errorBody.error.code || code;
          message = errorBody.error.message || message;
        }
      } catch {
        // Not a JSON error body
      }
      throw new ApiError(res.status, code, message);
    }

    const data = (await res.json()) as T;
    if (isGet) {
      cache.set(url, { data, expiry: Date.now() + 30000 });
    }
    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) {
      throw err;
    }
    if ((err as Error)?.name === "AbortError") {
      throw new ApiError(408, "TIMEOUT", "The request timed out. Please try again.");
    }
    throw new ApiError(500, "NETWORK_ERROR", (err as Error)?.message || "Network error");
  }
}

// ---------------------------------------------------------------------------
// Fallback local mock implementations (when VITE_API_URL is unset)
// ---------------------------------------------------------------------------

function getFallbackRawSkills(): Skill[] {
  return rawSkills as Skill[];
}

function mapSkillToSummary(s: Skill): ApiSkillSummary {
  const ver = s.version || s.ref.replace(/^v/, "") || "1.0.0";
  return {
    name: s.name || s.slug,
    latestVersion: ver,
    description: s.description,
    license: s.license || "MIT",
    category: s.category?.toLowerCase() || "other",
    compatibility: s.compatibility || ["claude", "cursor"],
    downloads: s.installs || 0,
    stars: s.stars || 0,
    verified: Boolean(s.verified),
    owner: {
      handle: s.author || "skillapt",
      avatarUrl: `https://github.com/${s.author || "skillapt"}.png`,
    },
    updatedAt: s.updatedAt || new Date().toISOString(),
  };
}

function mapSkillToDetail(s: Skill): ApiSkillDetail {
  const ver = s.version || s.ref.replace(/^v/, "") || "1.0.0";
  const permissions: ApiSkillPermissions = {
    network: false,
    shell: false,
    filesystem: "read",
  };

  const versionObj: ApiSkillVersion = {
    version: ver,
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    size: 14250,
    tarballUrl: `https://registry.skillapt.dev/v1/skills/${s.name || s.slug}/-/${ver}.tgz`,
    dependencies: {},
    publishedAt: s.updatedAt || "2026-11-01T12:00:00Z",
    yanked: false,
    permissions,
  };

  return {
    name: s.name || s.slug,
    description: s.description,
    license: s.license || "MIT",
    repository: `https://github.com/${s.repo}`,
    keywords: s.tags || [],
    category: s.category?.toLowerCase() || "other",
    compatibility: s.compatibility || ["claude", "cursor"],
    owner: {
      handle: s.author || "skillapt",
      avatarUrl: `https://github.com/${s.author || "skillapt"}.png`,
    },
    latestVersion: ver,
    downloads: s.installs || 0,
    stars: s.stars || 0,
    versions: {
      [ver]: versionObj,
    },
    readme: s.readmeMarkdown || `# ${s.name}\n\n${s.longDescription || s.description}`,
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: s.updatedAt || new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Exported API Client Object
// ---------------------------------------------------------------------------

let fallbackTokensStore: ApiToken[] = [
  {
    id: "tok_default_1",
    name: "cli-laptop",
    prefix: "apt_live_9f83",
    createdAt: "2026-10-01T15:00:00Z",
    lastUsedAt: "2026-11-06T18:22:10Z",
  },
];

function getStoredTokens(): ApiToken[] {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      const stored = localStorage.getItem("skillapt_mock_tokens");
      if (stored) {
        return JSON.parse(stored) as ApiToken[];
      }
    } catch {}
  }
  return fallbackTokensStore;
}

function saveStoredTokens(tokens: ApiToken[]) {
  fallbackTokensStore = tokens;
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("skillapt_mock_tokens", JSON.stringify(tokens));
    } catch {}
  }
}

let fallbackMockUser: ApiUser | null = null;

export function setFallbackMockUser(user: ApiUser | null) {
  fallbackMockUser = user;
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      if (user) {
        localStorage.setItem("skillapt_mock_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("skillapt_mock_user");
      }
    } catch {}
  }
}

export const api = {
  /**
   * Fetch skills with query, filters, sorting and pagination
   */
  async getSkills(params: SkillsQueryParams = {}): Promise<SkillsListResponse> {
    if (isUsingLiveApi()) {
      const search = new URLSearchParams();
      if (params.q) search.set("q", params.q);
      if (params.category && params.category !== "all") search.set("category", params.category);
      if (params.compat && params.compat !== "any") search.set("compat", params.compat);
      if (params.verified !== undefined) search.set("verified", String(params.verified));
      if (params.sort) search.set("sort", params.sort);
      if (params.page) search.set("page", String(params.page));
      if (params.limit) search.set("limit", String(params.limit));

      const queryStr = search.toString();
      return request<SkillsListResponse>(`/v1/skills${queryStr ? `?${queryStr}` : ""}`);
    }

    // Fallback mode using registry.json
    let list = getFallbackRawSkills();
    const q = params.q?.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.author.toLowerCase().includes(q)
      );
    }
    if (params.category && params.category.toLowerCase() !== "all") {
      list = list.filter(
        (s) =>
          s.category.toLowerCase() === params.category!.toLowerCase() ||
          s.tags.some((t) => t.toLowerCase() === params.category!.toLowerCase())
      );
    }
    if (params.compat && params.compat.toLowerCase() !== "any") {
      list = list.filter((s) =>
        s.compatibility.some((c) => c.toLowerCase() === params.compat!.toLowerCase())
      );
    }
    if (params.verified !== undefined && params.verified) {
      list = list.filter((s) => s.verified);
    }

    // Sort
    const sort = params.sort || "downloads";
    list = [...list].sort((a, b) => {
      if (sort === "name" || sort === "A–Z" || sort === "a-z") return a.name.localeCompare(b.name);
      if (sort === "recent" || sort === "Recently updated") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return (b.installs || 0) - (a.installs || 0);
    });

    const page = params.page || 1;
    const limit = params.limit || 20;
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paged = list.slice(start, start + limit).map(mapSkillToSummary);

    return {
      skills: paged,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  /**
   * Fetch full details for a single skill
   */
  async getSkill(name: string): Promise<ApiSkillDetail> {
    if (isUsingLiveApi()) {
      const encoded = encodeURIComponent(name);
      return request<ApiSkillDetail>(`/v1/skills/${encoded}`);
    }

    const found = getFallbackRawSkills().find(
      (s) => s.slug.toLowerCase() === name.toLowerCase() || s.name.toLowerCase() === name.toLowerCase()
    );
    if (!found) {
      throw new ApiError(404, "NOT_FOUND", `Skill '${name}' does not exist.`);
    }
    return mapSkillToDetail(found);
  },

  /**
   * Fetch specific version metadata
   */
  async getSkillVersion(name: string, version: string): Promise<ApiSkillVersion> {
    if (isUsingLiveApi()) {
      return request<ApiSkillVersion>(`/v1/skills/${encodeURIComponent(name)}/${encodeURIComponent(version)}`);
    }

    const detail = await this.getSkill(name);
    const ver = detail.versions[version];
    if (!ver) {
      throw new ApiError(404, "NOT_FOUND", `Version '${version}' for skill '${name}' does not exist.`);
    }
    return ver;
  },

  /**
   * Yank a version
   */
  async yankVersion(name: string, version: string, reason?: string): Promise<{ name: string; version: string; yanked: boolean; message: string }> {
    if (isUsingLiveApi()) {
      clearApiCache();
      return request(`/v1/skills/${encodeURIComponent(name)}/${encodeURIComponent(version)}/yank`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
    }

    clearApiCache();
    return {
      name,
      version,
      yanked: true,
      message: `Version ${version} has been yanked.`,
    };
  },

  /**
   * Un-yank a version
   */
  async unyankVersion(name: string, version: string): Promise<{ name: string; version: string; yanked: boolean; message: string }> {
    if (isUsingLiveApi()) {
      clearApiCache();
      return request(`/v1/skills/${encodeURIComponent(name)}/${encodeURIComponent(version)}/unyank`, {
        method: "POST",
      });
    }

    clearApiCache();
    return {
      name,
      version,
      yanked: false,
      message: `Version ${version} has been restored.`,
    };
  },

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<ApiUser | null> {
    if (isUsingLiveApi()) {
      try {
        return await request<ApiUser>("/v1/me");
      } catch (err) {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          return null;
        }
        throw err;
      }
    }

    if (fallbackMockUser) return fallbackMockUser;
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const mock = localStorage.getItem("skillapt_mock_user");
        if (mock) {
          fallbackMockUser = JSON.parse(mock) as ApiUser;
          return fallbackMockUser;
        }
      } catch {}
    }
    return null;
  },

  /**
   * Logout current session
   */
  async logout(): Promise<void> {
    if (isUsingLiveApi()) {
      clearApiCache();
      await request("/v1/auth/logout", { method: "POST" });
    }
    setFallbackMockUser(null);
    clearApiCache();
  },

  /**
   * List API tokens for current user
   */
  async getTokens(): Promise<ApiToken[]> {
    if (isUsingLiveApi()) {
      const res = await request<{ tokens: ApiToken[] }>("/v1/tokens");
      return res.tokens;
    }

    return getStoredTokens();
  },

  /**
   * Create a new API token
   */
  async createToken(name: string): Promise<CreateTokenResponse> {
    if (isUsingLiveApi()) {
      clearApiCache();
      return request<CreateTokenResponse>("/v1/tokens", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
    }

    const id = `tok_${Math.random().toString(36).substring(2, 10)}`;
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const token = `apt_live_${randomHex}`;
    const prefix = token.substring(0, 13);
    const createdAt = new Date().toISOString();

    const created: CreateTokenResponse = {
      id,
      name,
      token,
      createdAt,
      warning: "Copy this token now. It will not be shown again.",
    };

    const existing = getStoredTokens();
    const updated: ApiToken[] = [
      ...existing,
      { id, name, prefix, createdAt, lastUsedAt: undefined },
    ];
    saveStoredTokens(updated);

    return created;
  },

  /**
   * Revoke an API token
   */
  async revokeToken(id: string): Promise<void> {
    if (isUsingLiveApi()) {
      clearApiCache();
      await request(`/v1/tokens/${encodeURIComponent(id)}`, { method: "DELETE" });
      return;
    }

    const existing = getStoredTokens();
    const filtered = existing.filter((t) => t.id !== id);
    saveStoredTokens(filtered);
  },

  /**
   * Submit an abuse or security report
   */
  async submitReport(payload: ReportPayload): Promise<{ id: string; message: string }> {
    if (isUsingLiveApi()) {
      return request<{ id: string; message: string }>("/v1/reports", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    return {
      id: `rep_${Math.random().toString(36).substring(2, 8)}`,
      message: "Report received and queued for review. Thank you for keeping the registry safe.",
    };
  },

  /**
   * Get registry aggregates
   */
  async getStats(): Promise<ApiStats> {
    if (isUsingLiveApi()) {
      return request<ApiStats>("/v1/stats");
    }

    const all = getFallbackRawSkills();
    const authors = new Set(all.map((s) => s.author));
    const totalDownloads = all.reduce((acc, s) => acc + (s.installs || 0), 0);

    return {
      totalSkills: all.length,
      totalVersions: all.length * 2 + 5,
      totalDownloads,
      totalAuthors: authors.size,
    };
  },
};
