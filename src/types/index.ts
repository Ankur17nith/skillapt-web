export type Nav = (path: string) => void;

export type IconName =
  | "arrow"
  | "check"
  | "chevron"
  | "code"
  | "copy"
  | "download"
  | "filter"
  | "github"
  | "menu"
  | "moon"
  | "package"
  | "search"
  | "shield"
  | "star"
  | "sun"
  | "x";

export type Skill = {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  repo: string;
  subpath?: string;
  author: string;
  tags: string[];
  category: string;
  ref: string;
  stars: number;
  installs: number;
  verified: boolean;
  compatibility: string[];
  license: string;
  updatedAt: string;
  readmeMarkdown: string;
  version?: string;
};

export type Theme = "light" | "dark";

export type FilterOptions = {
  query?: string;
  category?: string;
  compat?: string;
  verified?: boolean;
  language?: string;
};

export type SortOption = "Recently updated" | "A–Z" | "Stars" | "Installs";
