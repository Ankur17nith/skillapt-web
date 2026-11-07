import rawSkills from "../data/registry.json";
import type { Skill, FilterOptions, SortOption } from "../types";

export function getSkills(): Skill[] {
  return rawSkills as Skill[];
}

export function getSkillBySlug(slug: string): Skill | undefined {
  return (rawSkills as Skill[]).find(
    (s) => s.slug.toLowerCase() === slug.toLowerCase() || s.name.toLowerCase() === slug.toLowerCase()
  );
}

export function getRelated(skill: Skill, limit: number = 3): Skill[] {
  return (rawSkills as Skill[])
    .filter((s) => s.slug !== skill.slug)
    .filter((s) => s.category === skill.category || s.tags.some((t) => skill.tags.includes(t)))
    .slice(0, limit);
}

export function getCategories(): string[] {
  const cats = new Set<string>();
  (rawSkills as Skill[]).forEach((s) => {
    if (s.category) cats.add(s.category);
  });
  return Array.from(cats);
}

export function getInstallCommand(skill: Skill): string {
  const sub = skill.subpath ? `/${skill.subpath}` : "";
  return `skillpm install ${skill.repo}${sub}`;
}

export function filterSkills(skillsList: Skill[], filters: FilterOptions): Skill[] {
  const { query, category, compat, verified, language } = filters;
  const q = query?.trim().toLowerCase();

  return skillsList.filter((s) => {
    if (q) {
      const matchName = s.name.toLowerCase().includes(q);
      const matchDesc = s.description.toLowerCase().includes(q);
      const matchLongDesc = s.longDescription?.toLowerCase().includes(q);
      const matchAuthor = s.author.toLowerCase().includes(q);
      const matchTags = s.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchLongDesc && !matchAuthor && !matchTags) {
        return false;
      }
    }

    if (category && category !== "" && category.toLowerCase() !== "all") {
      const matchCat = s.category.toLowerCase() === category.toLowerCase();
      const matchTag = s.tags.some((t) => t.toLowerCase() === category.toLowerCase());
      if (!matchCat && !matchTag) return false;
    }

    if (compat && compat !== "" && compat.toLowerCase() !== "any") {
      const hasCompat = s.compatibility.some(
        (c) => c.toLowerCase() === compat.toLowerCase()
      );
      if (!hasCompat) return false;
    }

    if (verified !== undefined && verified) {
      if (!s.verified) return false;
    }

    if (language && language !== "" && language.toLowerCase() !== "any") {
      const sLang = (s as any).language?.toLowerCase();
      if (sLang && sLang !== language.toLowerCase()) return false;
    }

    return true;
  });
}

export function sortSkills(skillsList: Skill[], sort: SortOption | string): Skill[] {
  const copy = [...skillsList];
  switch (sort) {
    case "A–Z":
    case "a-z":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "Stars":
    case "stars":
      return copy.sort((a, b) => b.stars - a.stars);
    case "Installs":
    case "installs":
      return copy.sort((a, b) => b.installs - a.installs);
    case "Recently updated":
    default:
      return copy.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
}

export function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date("2025-05-26T12:00:00Z");
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 1) return "1 week ago";
    if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} months ago`;
  } catch {
    return dateStr;
  }
}

export function getSkillLanguage(skill: Skill): string {
  if ((skill as any).language) return (skill as any).language;
  const lowerTags = skill.tags.map((t) => t.toLowerCase());
  if (lowerTags.includes("python") || skill.name.includes("sql") || skill.name.includes("csv")) return "Python";
  if (lowerTags.includes("markdown") || skill.name.includes("copywriter")) return "Markdown";
  return "TypeScript";
}

export function getRegistryStats() {
  const all = getSkills();
  const totalSkills = all.length;
  const totalInstalls = all.reduce((acc, s) => acc + (s.installs || 0), 0);
  const totalStars = all.reduce((acc, s) => acc + (s.stars || 0), 0);
  const verifiedCount = all.filter((s) => s.verified).length;

  return {
    totalSkills,
    totalInstalls,
    totalStars,
    verifiedCount,
  };
}
