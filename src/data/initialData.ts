import type { Skill } from "../types";

export const skills: Skill[] = [
  {
    name: "pdf-summarizer",
    author: "paperplane",
    description: "Extract, summarize, and query PDFs with citations and page references.",
    tags: ["documents", "research"],
    version: "2.4.1",
    updated: "2 days ago",
    language: "TypeScript",
    compatibility: ["Claude", "Cursor", "Codex"],
  },
  {
    name: "code-reviewer",
    author: "shipyard",
    description: "Review pull requests for bugs, security issues, and maintainability.",
    tags: ["coding", "github"],
    version: "1.8.0",
    updated: "4 days ago",
    language: "TypeScript",
    compatibility: ["Claude", "Cursor"],
  },
  {
    name: "sql-helper",
    author: "databloom",
    description: "Write, explain, and optimize SQL across common databases.",
    tags: ["data", "coding"],
    version: "3.1.2",
    updated: "6 days ago",
    language: "Python",
    compatibility: ["Claude", "Codex"],
  },
  {
    name: "web-researcher",
    author: "deeptrace",
    description: "Research topics across the web and return cited findings.",
    tags: ["research", "web"],
    version: "1.3.0",
    updated: "1 week ago",
    language: "Python",
    compatibility: ["Claude", "Cursor"],
  },
  {
    name: "ui-copywriter",
    author: "wordsmith",
    description: "Write concise, accessible product copy for interfaces.",
    tags: ["writing", "design"],
    version: "0.9.4",
    updated: "1 week ago",
    language: "Markdown",
    compatibility: ["Claude", "Cursor", "Codex"],
  },
  {
    name: "workflow-runner",
    author: "autopilot",
    description: "Run multi-step automations with review and approval gates.",
    tags: ["automation", "tools"],
    version: "2.0.0",
    updated: "2 weeks ago",
    language: "TypeScript",
    compatibility: ["Cursor", "Codex"],
  },
  {
    name: "api-tester",
    author: "requestly",
    description: "Test API endpoints and generate readable failure reports.",
    tags: ["coding", "testing"],
    version: "1.5.3",
    updated: "2 weeks ago",
    language: "TypeScript",
    compatibility: ["Claude", "Codex"],
  },
  {
    name: "csv-cleaner",
    author: "rows",
    description: "Normalize, validate, and clean tabular data files.",
    tags: ["data", "documents"],
    version: "1.2.1",
    updated: "3 weeks ago",
    language: "Python",
    compatibility: ["Claude", "Cursor"],
  },
  {
    name: "dependency-auditor",
    author: "safechain",
    description: "Check project dependencies for known risks and updates.",
    tags: ["security", "coding"],
    version: "0.8.2",
    updated: "3 weeks ago",
    language: "TypeScript",
    compatibility: ["Claude", "Cursor", "Codex"],
  },
];

export const faqs = [
  [
    "What is an AI agent skill?",
    "A skill is a portable package of instructions, tools, and context that gives an AI agent a specific capability.",
  ],
  [
    "Which agents does skillapt support?",
    "Skills can declare support for Claude, Cursor, Codex, and other compatible runtimes.",
  ],
  [
    "Are skills safe to install?",
    "Package pages show their source repository and requested permissions before installation.",
  ],
  [
    "Can I publish my own skill?",
    "Yes. Package your skill with skill.json and SKILL.md and publish using the skillapt CLI.",
  ],
  [
    "Is skillapt open source?",
    "The CLI, specification, and registry tooling are developed in public.",
  ],
];

export const categoryDescriptions: Record<string, string> = {
  Documents: "Read, transform, and organize files.",
  Coding: "Review, test, and maintain software.",
  Data: "Query, clean, and explain datasets.",
  Design: "Support interface and content workflows.",
  Writing: "Draft and revise clear technical copy.",
  Research: "Gather sources and structure findings.",
  Automation: "Connect tools and repeat workflows.",
  Security: "Audit dependencies and permissions.",
};

export const collections = [
  [
    "Start with documents",
    "Skills for extracting, cleaning, and summarizing files.",
    ["pdf-summarizer", "csv-cleaner"],
  ],
  [
    "Review before merge",
    "Tools for pull requests, dependencies, and API checks.",
    ["code-reviewer", "dependency-auditor", "api-tester"],
  ],
  [
    "Research with sources",
    "Skills that collect and organize referenced material.",
    ["web-researcher", "pdf-summarizer"],
  ],
];
