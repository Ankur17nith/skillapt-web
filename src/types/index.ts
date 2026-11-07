import type { ReactNode } from "react";

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
  author: string;
  description: string;
  tags: string[];
  version: string;
  updated: string;
  language: string;
  compatibility: string[];
};

export type Theme = "light" | "dark";
