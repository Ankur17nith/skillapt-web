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
