import type { IconName } from "../types";

/**
 * What a skill is for. Mirrors the registry's taxonomy (GET /v1/categories), which is the
 * source of truth when a registry is configured; this list is the offline/demo fallback
 * and supplies labels and icons either way.
 */
export interface CategoryMeta {
  id: string;
  label: string;
  description: string;
  icon: IconName;
}

export const CATEGORIES: readonly CategoryMeta[] = [
  { id: "documents", label: "Documents", icon: "package", description: "Create, read, convert or summarise PDFs, Word, slides, spreadsheets and other files." },
  { id: "coding", label: "Coding", icon: "code", description: "Write, refactor, review or explain source code in any language." },
  { id: "testing", label: "Testing & QA", icon: "check", description: "Generate tests, debug failures, check quality and accessibility." },
  { id: "devtools", label: "Developer tools", icon: "code", description: "Git, build tools, linters, CLIs, editors and release workflows." },
  { id: "devops", label: "DevOps & cloud", icon: "package", description: "Deploy, monitor and operate infrastructure, containers, CI/CD and cloud services." },
  { id: "database", label: "Databases", icon: "package", description: "Design schemas, write queries, run migrations and inspect data stores." },
  { id: "data", label: "Data & analytics", icon: "package", description: "Clean, analyse and visualise data, build reports and dashboards." },
  { id: "research", label: "Research", icon: "search", description: "Search the web, gather sources, compare options and write findings." },
  { id: "writing", label: "Writing & content", icon: "package", description: "Draft, edit, translate and format articles, docs and copy." },
  { id: "design", label: "Design & UI", icon: "package", description: "Design interfaces, generate assets, apply design systems and layouts." },
  { id: "security", label: "Security", icon: "shield", description: "Audit code and dependencies, find vulnerabilities, manage secrets safely." },
  { id: "automation", label: "Automation", icon: "package", description: "Run repetitive tasks, scrape pages, schedule jobs and glue services together." },
  { id: "ai-agents", label: "AI agents & prompts", icon: "package", description: "Build agents, MCP servers, prompts, evals and multi-agent workflows." },
  { id: "communication", label: "Communication", icon: "package", description: "Email, chat, meetings, notifications and customer messaging." },
  { id: "productivity", label: "Productivity", icon: "check", description: "Notes, tasks, calendars, planning and personal workflows." },
  { id: "marketing", label: "Marketing & SEO", icon: "package", description: "Campaigns, SEO, analytics, social posts and growth tasks." },
  { id: "finance", label: "Finance & business", icon: "package", description: "Accounting, invoices, reports, e-commerce and business operations." },
  { id: "education", label: "Education", icon: "package", description: "Teach, tutor, make quizzes and learning material." },
  { id: "media", label: "Media", icon: "package", description: "Images, audio, video and creative generation." },
  { id: "other", label: "Other", icon: "package", description: "Skills that do not fit any other category." },
];

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: string): CategoryMeta | undefined {
  return BY_ID.get(id.toLowerCase());
}

/** Human label for a category id, falling back to a capitalised id for unknown ones. */
export function categoryLabel(id: string): string {
  const known = getCategory(id);
  if (known) return known.label;
  return id ? id.charAt(0).toUpperCase() + id.slice(1) : "Other";
}
