import Fuse from "fuse.js";
import { getSkills } from "./skills";
import type { Skill } from "../types";

let fuseInstance: Fuse<Skill> | null = null;

export function getFuseIndex(): Fuse<Skill> {
  if (!fuseInstance) {
    const all = getSkills();
    fuseInstance = new Fuse(all, {
      keys: [
        { name: "name", weight: 0.4 },
        { name: "tags", weight: 0.3 },
        { name: "description", weight: 0.2 },
        { name: "author", weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }
  return fuseInstance;
}

export function searchSkillsWithFuse(query: string): Skill[] {
  if (!query || !query.trim()) return getSkills();
  const fuse = getFuseIndex();
  return fuse.search(query).map((res) => res.item);
}
