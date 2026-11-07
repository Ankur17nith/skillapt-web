import { useEffect, useState, type ReactNode } from "react";

type IconName =
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
const paths: Record<IconName, ReactNode> = {
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  code: <path d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-10-4 14" />,
  copy: (
    <>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  github: (
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.3 4 5 5 0 0 0 19.2.5S18 0 15 2a13.4 13.4 0 0 0-7 0C5-.1 3.8.5 3.8.5A5 5 0 0 0 3.7 4a5.4 5.4 0 0 0-1.5 3.7c0 5.3 3.5 6.5 6.8 7A4.8 4.8 0 0 0 8 18v4M8 19c-3 .9-3-1.5-4-2" />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
  package: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 7 9 5 9-5v10l-9 5-9-5V7Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  star: <path d="m12 2 3 6 6.5 1-4.7 4.6 1.1 6.4-5.9-3.1L6.1 20l1.1-6.4L2.5 9 9 8l3-6Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  x: <path d="m6 6 12 12M18 6 6 18" />,
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

type Nav = (path: string) => void;
function Link({
  to,
  nav,
  children,
  className = "",
  label,
}: {
  to: string;
  nav: Nav;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={to}
      className={className}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        nav(to);
      }}
    >
      {children}
    </a>
  );
}

function Logo({
  variant = "full",
  size = 32,
  nav,
  className = "",
}: {
  variant?: "full" | "mark";
  size?: number;
  nav?: Nav;
  className?: string;
}) {
  const width = variant === "full" ? size * 4.15 : size;
  const artwork = (
    <svg
      className="logo-art"
      width={width}
      height={size}
      viewBox={variant === "full" ? "0 0 133 32" : "0 0 32 32"}
      role="img"
      aria-label="skillpm"
    >
      <rect x="5" y="4" width="22" height="6" rx="3" fill="currentColor" />
      <rect x="5" y="8" width="6" height="8" rx="3" fill="currentColor" />
      <rect x="5" y="13" width="22" height="6" rx="3" fill="currentColor" />
      <rect x="21" y="16" width="6" height="8" rx="3" fill="#4169E1" />
      <rect x="5" y="22" width="22" height="6" rx="3" fill="currentColor" />
      {variant === "full" && (
        <text
          x="42"
          y="24"
          fill="currentColor"
          fontFamily="Inter, sans-serif"
          fontSize="26"
          fontWeight="600"
          letterSpacing="-0.26"
        >
          skillpm
        </text>
      )}
    </svg>
  );
  return nav ? (
    <Link to="/" nav={nav} className={`logo ${className}`} label="skillpm home">
      {artwork}
    </Link>
  ) : (
    <span className={`logo ${className}`} aria-label="skillpm">
      {artwork}
    </span>
  );
}

function Button({
  children,
  variant = "primary",
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
}) {
  return (
    <button className={`button ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

function ThemeToggle({ theme, toggle }: { theme: string; toggle: () => void }) {
  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
      <Icon name={theme === "light" ? "sun" : "moon"} size={16} />
    </button>
  );
}

function Navbar({
  nav,
  theme,
  toggleTheme,
  openPalette,
}: {
  nav: Nav;
  theme: string;
  toggleTheme: () => void;
  openPalette: () => void;
}) {
  const [open, setOpen] = useState(false);
  const items = [
    ["Home", "/"],
    ["Discover", "/browse"],
    ["Categories", "/categories"],
    ["Collections", "/collections"],
    ["Publish", "/submit"],
    ["Documentation", "/docs"],
  ];
  return (
    <>
      <nav className="navbar">
        <Logo variant="full" nav={nav} />
        <div className="nav-links">
          {items.slice(1).map(([label, path]) => (
            <Link key={path} to={path} nav={nav}>
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <button className="nav-search" onClick={openPalette}>
            <Icon name="search" size={15} />
            Search <kbd>⌘K</kbd>
          </button>
          <a className="icon-button" href="https://github.com" aria-label="GitHub">
            <Icon name="github" />
          </a>
          <ThemeToggle theme={theme} toggle={toggleTheme} />
          <Button onClick={() => nav("/docs")}>Install CLI</Button>
        </div>
        <button className="mobile-menu-button" onClick={() => setOpen(true)}>
          <Icon name="menu" />
        </button>
      </nav>
      {open && (
        <div className="full-menu">
          <div>
            <Logo variant="mark" nav={nav} />
            <button onClick={() => setOpen(false)}>
              <Icon name="x" />
            </button>
          </div>
          {items.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              nav={(p) => {
                nav(p);
                setOpen(false);
              }}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </div>
      )}
    </>
  );
}

function SearchBar({
  compact = false,
  openPalette,
}: {
  compact?: boolean;
  openPalette: () => void;
}) {
  return (
    <button className={`search-bar ${compact ? "compact" : ""}`} onClick={openPalette}>
      <Icon name="search" />
      <span>Search skills... try 'pdf'</span>
      <kbd>⌘ K</kbd>
    </button>
  );
}

function CopyCommand({ command, notify }: { command: string; notify: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(command);
    setCopied(true);
    notify();
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="copy-command">
      <code>
        <span>$</span> {command}
      </code>
      <button onClick={copy}>
        <Icon name={copied ? "check" : "copy"} size={15} />
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function TerminalWindow() {
  return (
    <div className="terminal">
      <div className="terminal-title">
        <Logo variant="mark" size={14} />
        Terminal
      </div>
      <div className="terminal-body">
        <p>
          <span>$</span> skillpm install pdf-summarizer
        </p>
        <p className="muted">Resolving skill manifest...</p>
        <p className="muted">Verifying publisher signature...</p>
        <p className="muted">Checking requested permissions...</p>
        <p className="success">✓ Installed pdf-summarizer@2.4.1</p>
      </div>
    </div>
  );
}

type Skill = {
  name: string;
  author: string;
  description: string;
  tags: string[];
  version: string;
  updated: string;
  language: string;
  compatibility: string[];
};
const skills: Skill[] = [
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

function SkillCard({ skill, nav, hover = false }: { skill: Skill; nav: Nav; hover?: boolean }) {
  return (
    <article
      className={`skill-card ${hover ? "hover-example" : ""}`}
      onClick={() => nav("/skills/pdf-summarizer")}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") nav("/skills/pdf-summarizer");
      }}
      role="link"
      tabIndex={0}
    >
      <div className="skill-head">
        <span className="skill-icon">
          <Icon name="package" />
        </span>
        <code>v{skill.version}</code>
      </div>
      <h3>{skill.name}</h3>
      <span className="author">by @{skill.author}</span>
      <p>{skill.description}</p>
      <div className="tags">
        {skill.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="skill-meta">
        <span>{skill.language}</span>
        <span>{skill.compatibility.join(" · ")}</span>
        <span>{skill.updated}</span>
      </div>
    </article>
  );
}

function SkillListItem({ skill, nav }: { skill: Skill; nav: Nav }) {
  return (
    <article className="skill-list-item">
      <button className="skill-list-main" onClick={() => nav("/skills/pdf-summarizer")}>
        <span className="skill-icon">
          <Icon name="package" size={16} />
        </span>
        <span>
          <strong>{skill.name}</strong>
          <small>@{skill.author}</small>
        </span>
        <p>{skill.description}</p>
      </button>
      <div className="skill-list-details">
        <code>v{skill.version}</code>
        <span>{skill.language}</span>
        <span>{skill.compatibility.join(", ")}</span>
        <span>Updated {skill.updated}</span>
      </div>
    </article>
  );
}

function FeatureCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="feature-card">
      <Icon name="shield" />
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}
function StepCard({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="step-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

const faqs = [
  [
    "What is an AI agent skill?",
    "A skill is a portable package of instructions, tools, and context that gives an AI agent a specific capability.",
  ],
  [
    "Which agents does skillpm support?",
    "Skills can declare support for Claude, Cursor, Codex, and other compatible runtimes.",
  ],
  [
    "Are skills safe to install?",
    "Package pages show their source repository and requested permissions before installation.",
  ],
  [
    "Can I publish my own skill?",
    "Yes. Add a SKILL.md file to a public repository and submit it for review.",
  ],
  [
    "Is skillpm open source?",
    "The CLI, specification, and registry tooling are developed in public.",
  ],
];
function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {faqs.map(([q, a], i) => (
        <div className="faq-item" key={q}>
          <button onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{q}</span>
            <Icon name="chevron" />
          </button>
          {open === i && <p>{a}</p>}
        </div>
      ))}
    </div>
  );
}

function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {children}
    </header>
  );
}
function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action}
    </div>
  );
}

function Footer({ nav }: { nav: Nav }) {
  const groups = [
    [
      "Product",
      ["Discover", "/browse"],
      ["Categories", "/categories"],
      ["Collections", "/collections"],
    ],
    ["Developers", ["Publish", "/submit"], ["Documentation", "/docs"], ["Security", "/security"]],
    ["Project", ["About", "/about"], ["Brand assets", "/brand"], ["GitHub", "https://github.com"]],
  ] as const;
  return (
    <footer>
      <div className="footer-main">
        <div>
          <Logo variant="full" nav={nav} />
          <p>The open package manager for trusted AI agent skills.</p>
        </div>
        {groups.map(([title, ...items]) => (
          <div key={title}>
            <strong>{title}</strong>
            {items.map(([label, path]) =>
              path.startsWith("http") ? (
                <a key={label} href={path}>
                  {label}
                </a>
              ) : (
                <Link key={label} to={path} nav={nav}>
                  {label}
                </Link>
              ),
            )}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2025 skillpm. Open source.</span>
        <span>Built for reusable agent skills.</span>
      </div>
    </footer>
  );
}

function Home({
  nav,
  openPalette,
  notify,
}: {
  nav: Nav;
  openPalette: () => void;
  notify: () => void;
}) {
  return (
    <>
      <section className="home-hero">
        <div className="hero-grid">
          <div>
            <span className="hero-kicker">Discover. Install. Build. Share.</span>
            <h1>Your AI skills, one package away.</h1>
            <p>Discover, install, and share reusable skills for the AI agents you build with.</p>
            <SearchBar openPalette={openPalette} />
            <CopyCommand command="npx skillpm install user/repo" notify={notify} />
            <div className="hero-actions">
              <Button onClick={() => nav("/browse")}>Browse skills</Button>
              <Link to="/docs" nav={nav} className="hero-docs">
                Read the CLI docs
              </Link>
            </div>
            <p className="works">Works with Claude, Cursor and Codex.</p>
          </div>
          <TerminalWindow />
        </div>
      </section>
      <main className="shell">
        <section>
          <SectionTitle
            title="Recently updated"
            action={
              <Link to="/browse" nav={nav}>
                View all
              </Link>
            }
          />
          <div className="skill-list home-skill-list">
            {skills.slice(0, 5).map((s) => (
              <SkillListItem key={s.name} skill={s} nav={nav} />
            ))}
          </div>
        </section>
        <section>
          <SectionTitle title="Browse by category" />
          <div className="category-grid">
            {[
              "Documents",
              "Coding",
              "Data",
              "Design",
              "Writing",
              "Research",
              "Automation",
              "Security",
            ].map((c) => (
              <Link key={c} to="/categories" nav={nav}>
                <Icon name={c === "Security" ? "shield" : c === "Coding" ? "code" : "package"} />
                <span>{c}</span>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <SectionTitle title="How it works" />
          <div className="steps">
            <StepCard number="1" title="Find">
              Search for a skill that matches your work.
            </StepCard>
            <StepCard number="2" title="Install">
              Run one command and review permissions.
            </StepCard>
            <StepCard number="3" title="Your agent uses it">
              The skill is added to your agent's toolkit.
            </StepCard>
          </div>
        </section>
        <section>
          <SectionTitle title="Built for trust" />
          <div className="feature-grid">
            <FeatureCard title="Repository provenance">
              Source links and package history stay visible.
            </FeatureCard>
            <FeatureCard title="Security scanning">Automated checks on every release.</FeatureCard>
            <FeatureCard title="Open source">Inspect source and requested permissions.</FeatureCard>
          </div>
          <Link to="/security" nav={nav} className="inline-link">
            Learn about security
          </Link>
        </section>
        <section className="cta">
          <div>
            <h2>Share your skill with the world</h2>
            <p>Publish your agent capability in the public registry.</p>
          </div>
          <Button onClick={() => nav("/submit")}>Submit a skill</Button>
        </section>
        <section>
          <SectionTitle title="Questions, answered" />
          <FAQ />
        </section>
      </main>
    </>
  );
}

function FilterSidebar({
  category,
  compatibility,
  language,
  setCategory,
  setCompatibility,
  setLanguage,
  clear,
  close,
}: {
  category: string;
  compatibility: string;
  language: string;
  setCategory: (value: string) => void;
  setCompatibility: (value: string) => void;
  setLanguage: (value: string) => void;
  clear: () => void;
  close?: () => void;
}) {
  return (
    <aside className="filters">
      <div className="filter-head">
        <strong>Filters</strong>
        <button onClick={clear}>Clear all</button>
        {close && (
          <button onClick={close}>
            <Icon name="x" />
          </button>
        )}
      </div>
      <fieldset>
        <legend>Category</legend>
        {["", "Coding", "Documents", "Data", "Research", "Security"].map((item) => (
          <label key={item || "all"}>
            <input
              type="radio"
              name="category"
              checked={category === item}
              onChange={() => setCategory(item)}
            />
            {item || "All categories"}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Compatibility</legend>
        {["", "Claude", "Cursor", "Codex"].map((item) => (
          <label key={item || "all"}>
            <input
              type="radio"
              name="compatibility"
              checked={compatibility === item}
              onChange={() => setCompatibility(item)}
            />
            {item || "Any agent"}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Language</legend>
        {["", "TypeScript", "Python", "Markdown"].map((item) => (
          <label key={item || "all"}>
            <input
              type="radio"
              name="language"
              checked={language === item}
              onChange={() => setLanguage(item)}
            />
            {item || "Any language"}
          </label>
        ))}
      </fieldset>
    </aside>
  );
}
function LoadingState() {
  return (
    <div className="loading-state" aria-label="Loading skills">
      {[1, 2, 3].map((n) => (
        <div key={n}>
          <i />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
function EmptyState({ clear }: { clear: () => void }) {
  return (
    <div className="empty-state">
      <Icon name="search" />
      <h2>No skills found</h2>
      <p>Try a broader search or remove a filter.</p>
      <Button variant="secondary" onClick={clear}>
        Clear filters
      </Button>
    </div>
  );
}

function Browse({ nav }: { nav: Nav; openPalette: () => void }) {
  const [sheet, setSheet] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [compatibility, setCompatibility] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("Recently updated");
  const [view, setView] = useState<"list" | "grid">("list");
  const clear = () => {
    setQuery("");
    setCategory("");
    setCompatibility("");
    setLanguage("");
  };
  const results = skills
    .filter(
      (skill) =>
        !query ||
        `${skill.name} ${skill.description} ${skill.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .filter(
      (skill) =>
        !category || skill.tags.some((tag) => tag.toLowerCase() === category.toLowerCase()),
    )
    .filter((skill) => !compatibility || skill.compatibility.includes(compatibility))
    .filter((skill) => !language || skill.language === language)
    .sort((a, b) =>
      sort === "A–Z" ? a.name.localeCompare(b.name) : skills.indexOf(a) - skills.indexOf(b),
    );
  const filterProps = {
    category,
    compatibility,
    language,
    setCategory,
    setCompatibility,
    setLanguage,
    clear,
  };
  return (
    <main className="shell page">
      <PageHeader title="Browse skills">
        <span>{results.length} packages</span>
      </PageHeader>
      <div className="browse-tools">
        <label className="registry-search">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, function, or tag"
          />
        </label>
        <button className="filter-button" onClick={() => setSheet(true)}>
          <Icon name="filter" />
          Filters
        </button>
        <label className="select-wrap">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Recently updated</option>
            <option>A–Z</option>
          </select>
        </label>
      </div>
      <div className="browse-layout">
        <FilterSidebar {...filterProps} />
        <div className="results">
          <div className="results-bar">
            <span>{results.length} results</span>
            <div className="view-toggle">
              <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
                List
              </button>
              <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>
                Grid
              </button>
            </div>
          </div>
          {(category || compatibility || language) && (
            <div className="active-filters">
              {[category, compatibility, language].filter(Boolean).map((value) => (
                <span key={value}>
                  {value}
                  <button
                    onClick={() =>
                      value === category
                        ? setCategory("")
                        : value === compatibility
                          ? setCompatibility("")
                          : setLanguage("")
                    }
                  >
                    <Icon name="x" size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}
          {results.length === 0 ? (
            <EmptyState clear={clear} />
          ) : view === "list" ? (
            <div className="skill-list">
              {results.map((skill) => (
                <SkillListItem key={skill.name} skill={skill} nav={nav} />
              ))}
            </div>
          ) : (
            <div className="card-grid">
              {results.map((skill) => (
                <SkillCard key={skill.name} skill={skill} nav={nav} />
              ))}
            </div>
          )}
        </div>
      </div>
      {sheet && (
        <div className="sheet-backdrop" onClick={() => setSheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <FilterSidebar {...filterProps} close={() => setSheet(false)} />
            <Button onClick={() => setSheet(false)}>Show {results.length} packages</Button>
          </div>
        </div>
      )}
    </main>
  );
}

const categoryDescriptions: Record<string, string> = {
  Documents: "Read, transform, and organize files.",
  Coding: "Review, test, and maintain software.",
  Data: "Query, clean, and explain datasets.",
  Design: "Support interface and content workflows.",
  Writing: "Draft and revise clear technical copy.",
  Research: "Gather sources and structure findings.",
  Automation: "Connect tools and repeat workflows.",
  Security: "Audit dependencies and permissions.",
};

function Categories({ nav }: { nav: Nav }) {
  return (
    <main className="shell page">
      <PageHeader title="Categories">
        <p>Browse skills by the work they help an agent perform.</p>
      </PageHeader>
      <div className="category-directory">
        {Object.entries(categoryDescriptions).map(([name, description]) => (
          <Link key={name} to="/browse" nav={nav}>
            <span>
              <Icon
                name={name === "Security" ? "shield" : name === "Coding" ? "code" : "package"}
                size={18}
              />
            </span>
            <div>
              <strong>{name}</strong>
              <p>{description}</p>
            </div>
            <Icon name="arrow" size={16} />
          </Link>
        ))}
      </div>
    </main>
  );
}

function Collections({ nav }: { nav: Nav }) {
  const collections = [
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
  return (
    <main className="shell page">
      <PageHeader title="Collections">
        <p>Small, maintained sets for common developer workflows.</p>
      </PageHeader>
      <div className="collection-list">
        {collections.map(([title, description, names]) => (
          <section key={title as string}>
            <div>
              <span>Collection</span>
              <h2>{title as string}</h2>
              <p>{description as string}</p>
            </div>
            <ul>
              {(names as string[]).map((name) => (
                <li key={name}>
                  <button onClick={() => nav("/skills/pdf-summarizer")}>
                    <Icon name="package" size={16} />
                    {name}
                    <Icon name="arrow" size={15} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-block">
      <button
        onClick={() => {
          navigator.clipboard?.writeText(children);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        <Icon name={copied ? "check" : "copy"} size={15} />
        {copied ? "Copied" : "Copy"}
      </button>
      <pre>{children}</pre>
    </div>
  );
}

function ReportModal({ close }: { close: () => void }) {
  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="report-title">
        <div className="modal-head">
          <h2 id="report-title">Report skill</h2>
          <button onClick={close}>
            <Icon name="x" />
          </button>
        </div>
        <label>
          Reason
          <select>
            <option>Security concern</option>
            <option>Misleading information</option>
            <option>Broken package</option>
          </select>
        </label>
        <label>
          Details
          <textarea rows={5} placeholder="Tell us what happened" />
        </label>
        <div className="modal-actions">
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <button className="button" disabled title="Reporting requires the registry service">
            Submission unavailable
          </button>
        </div>
      </div>
    </div>
  );
}

function SkillDetail({ nav, notify }: { nav: Nav; notify: () => void }) {
  const [tab, setTab] = useState("README");
  const [installMode, setInstallMode] = useState("skillpm");
  const [report, setReport] = useState(false);
  const installCommands: Record<string, string> = {
    skillpm: "skillpm install paperplane/pdf-summarizer",
    npx: "npx skillpm install paperplane/pdf-summarizer",
    manual: "git clone github.com/paperplane/pdf-summarizer",
  };
  return (
    <main className="shell page">
      <div className="breadcrumbs">
        <Link to="/" nav={nav}>
          Home
        </Link>
        <span>/</span>
        <Link to="/browse" nav={nav}>
          Browse
        </Link>
        <span>/</span>
        <span>pdf-summarizer</span>
      </div>
      <div className="detail-grid">
        <article className="detail-main">
          <div className="detail-title">
            <span className="large-icon">
              <Icon name="package" />
            </span>
            <div>
              <div>
                <h1>pdf-summarizer</h1>
              </div>
              <p>by @paperplane</p>
            </div>
          </div>
          <p className="lead">
            Extract, summarize, and query any PDF with citations and page-level references.
          </p>
          <div className="tags">
            <span>documents</span>
            <span>research</span>
            <span>pdf</span>
          </div>
          <dl className="metadata">
            <div>
              <dt>Version</dt>
              <dd>2.4.1</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>May 24, 2025</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>MIT</dd>
            </div>
          </dl>
          <div className="tabs">
            {["README", "Versions", "Security"].map((t) => (
              <button className={tab === t ? "active" : ""} onClick={() => setTab(t)} key={t}>
                {t}
              </button>
            ))}
          </div>
          {tab === "README" && (
            <div className="markdown">
              <Logo variant="full" />
              <h2>PDF Summarizer</h2>
              <p>
                Give your agent a reliable way to read long PDF files and return structured
                summaries with citations.
              </p>
              <h3>Installation</h3>
              <CodeBlock>skillpm install paperplane/pdf-summarizer</CodeBlock>
              <h3>What it can do</h3>
              <ul>
                <li>Extract text from local and remote PDF files</li>
                <li>Return summaries with page-level citations</li>
                <li>Answer questions using only the supplied document</li>
              </ul>
              <h3>Usage</h3>
              <CodeBlock>{`agent.use("pdf-summarizer", {\n  file: "./annual-report.pdf",\n  format: "brief"\n})`}</CodeBlock>
            </div>
          )}
          {tab === "Versions" && (
            <div className="tab-panel">
              <h2>Version history</h2>
              <p>2.4.1 — Improved citation accuracy and large-file handling.</p>
            </div>
          )}
          {tab === "Security" && (
            <div className="security-panel">
              <h2>Security report</h2>
              <div>
                <Icon name="check" />{" "}
                <span>
                  <strong>Scanned</strong> No known issues found
                </span>
              </div>
              <div className="warning">
                <span>!</span>
                <span>
                  <strong>Permissions requested</strong> File read and network access
                </span>
              </div>
              <div>
                <Icon name="check" />
                <span>
                  <strong>Last scan date</strong> May 24, 2025
                </span>
              </div>
            </div>
          )}
        </article>
        <aside className="install-panel">
          <div className="mini-tabs">
            {Object.keys(installCommands).map((mode) => (
              <button
                className={installMode === mode ? "active" : ""}
                onClick={() => setInstallMode(mode)}
                key={mode}
              >
                {mode}
              </button>
            ))}
          </div>
          <CopyCommand command={installCommands[installMode]} notify={notify} />
          <Button onClick={() => window.open("https://github.com", "_blank")}>
            View on GitHub
          </Button>
          <Button variant="ghost" onClick={() => setReport(true)}>
            Report
          </Button>
          <dl className="package-facts">
            <div>
              <dt>Version</dt>
              <dd>2.4.1</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>MIT</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>TypeScript</dd>
            </div>
            <div>
              <dt>Repository</dt>
              <dd>paperplane/pdf-summarizer</dd>
            </div>
            <div>
              <dt>Dependencies</dt>
              <dd>pdf.js, zod</dd>
            </div>
          </dl>
          <div className="compatibility">
            <strong>Compatibility</strong>
            <span>Claude</span>
            <span>Cursor</span>
            <span>Codex</span>
          </div>
        </aside>
      </div>
      <section className="related">
        <SectionTitle title="Related skills" />
        <div className="card-grid">
          {skills.slice(1, 4).map((s) => (
            <SkillCard key={s.name} skill={s} nav={nav} />
          ))}
        </div>
      </section>
      <div className="mobile-install">
        <CopyCommand command="skillpm install paperplane/pdf-summarizer" notify={notify} />
        <Button onClick={() => window.open("https://github.com", "_blank")}>View on GitHub</Button>
      </div>
      {report && <ReportModal close={() => setReport(false)} />}
    </main>
  );
}

function Submit() {
  const [repo, setRepo] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");
  const generate = () => {
    if (!repo.startsWith("https://github.com/")) {
      setError("Enter a public GitHub repository URL.");
      return;
    }
    if (!name.trim()) {
      setError("Add a package name.");
      return;
    }
    setError("");
    setGenerated(true);
  };
  return (
    <main className="shell page">
      <PageHeader title="Submit a skill">
        <p>Add your skill to the public registry.</p>
      </PageHeader>
      <div className="submit-steps">
        <StepCard number="1" title="Add a SKILL.md">
          Describe capabilities and permissions.
        </StepCard>
        <StepCard number="2" title="Open a pull request">
          Generate the registry entry.
        </StepCard>
        <StepCard number="3" title="Get reviewed">
          Automated checks and human review.
        </StepCard>
      </div>
      <section className="form-card">
        <div className="form-intro">
          <span>Frontend preview</span>
          <h2>Package metadata</h2>
          <p>
            This form validates and generates a registry entry locally. Publishing happens through a
            GitHub pull request.
          </p>
        </div>
        <div className="form-grid">
          <label className="span-2">
            GitHub repository URL
            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="https://github.com/user/repo"
            />
          </label>
          <label>
            Package name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="pdf-summarizer"
            />
          </label>
          <label>
            Version
            <input defaultValue="0.1.0" />
          </label>
          <label>
            License
            <select defaultValue="MIT">
              <option>MIT</option>
              <option>Apache-2.0</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Category
            <select defaultValue="">
              <option value="" disabled>
                Select category
              </option>
              <option>Documents</option>
              <option>Coding</option>
              <option>Research</option>
            </select>
          </label>
          <label className="span-2">
            Skill manifest path
            <input defaultValue="SKILL.md" />
          </label>
          <fieldset className="span-2">
            <legend>Compatibility</legend>
            {["Claude", "Cursor", "Codex"].map((agent) => (
              <label key={agent}>
                <input type="checkbox" />
                {agent}
              </label>
            ))}
          </fieldset>
          <label className="span-2">
            Short description
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={160}
              placeholder="Describe what the skill does and when to use it."
            />
            <small>{description.length}/160</small>
          </label>
          {error && (
            <p className="field-error span-2" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>
      <div className="generate">
        <Button onClick={generate}>Generate registry entry</Button>
        {generated && (
          <>
            <CodeBlock>{`{\n  "name": "${name}",\n  "repository": "${repo}",\n  "version": "0.1.0",\n  "manifest": "SKILL.md"\n}`}</CodeBlock>
            <Button
              onClick={() => window.open("https://github.com/skillpm/registry/compare", "_blank")}
            >
              Open pull request
            </Button>
          </>
        )}
      </div>
    </main>
  );
}

const docSections = [
  "Getting started",
  "Installing skills",
  "Writing a skill",
  "CLI reference",
  "FAQ",
];
function Docs({ nav }: { nav: Nav }) {
  return (
    <main className="docs-layout">
      <aside className="docs-nav">
        <Logo variant="full" nav={nav} />
        <strong>Documentation</strong>
        {docSections.map((s) => (
          <a href={`#${s.replaceAll(" ", "-")}`} key={s}>
            {s}
          </a>
        ))}
      </aside>
      <article className="docs-article">
        <span className="label">Getting started</span>
        <h1>Install your first skill</h1>
        <p className="lead">Use skillpm to find and add capabilities to your AI agent.</p>
        <h2 id="Installing-skills">Install the CLI</h2>
        <p>
          The skillpm CLI works with Node.js 20 or newer. Install it globally or run it with npx.
        </p>
        <CodeBlock>npm install -g skillpm</CodeBlock>
        <div className="callout">
          <strong>Before you install</strong>
          <p>Review the source, requested permissions, and compatibility list for every skill.</p>
        </div>
        <h2 id="Writing-a-skill">Install a skill</h2>
        <p>Pass the publisher and skill name to the install command.</p>
        <CodeBlock>skillpm install paperplane/pdf-summarizer</CodeBlock>
        <h2 id="CLI-reference">Check installed skills</h2>
        <CodeBlock>skillpm list</CodeBlock>
        <div className="docs-pager">
          <a href="#Installing-skills">← Installation</a>
          <a href="#Writing-a-skill">Writing a skill →</a>
        </div>
      </article>
      <aside className="docs-outline">
        <strong>On this page</strong>
        <a href="#Installing-skills">Install the CLI</a>
        <a href="#Writing-a-skill">Install a skill</a>
        <a href="#CLI-reference">Check installed skills</a>
      </aside>
    </main>
  );
}
function Security({ nav }: { nav: Nav }) {
  return (
    <main className="shell page">
      <PageHeader title="How we keep skills safe">
        <p>Clear checks, visible permissions, and a public process.</p>
      </PageHeader>
      <div className="feature-grid">
        <FeatureCard title="Repository provenance">
          Package pages link directly to their source and history.
        </FeatureCard>
        <FeatureCard title="Automated scanning">
          Every release is checked for risky behavior.
        </FeatureCard>
        <FeatureCard title="Visible permissions">
          Skills declare what they can access before install.
        </FeatureCard>
      </div>
      <section>
        <SectionTitle title="Tips before installing a skill" />
        <ul className="checklist">
          {[
            "Review the source repository and recent changes",
            "Check the publisher identity and package history",
            "Read every requested permission",
            "Pin versions in shared or production environments",
          ].map((x) => (
            <li key={x}>
              <Icon name="check" />
              {x}
            </li>
          ))}
        </ul>
      </section>
      <section className="cta">
        <div>
          <h2>Report a problem</h2>
          <p>Tell us about suspicious behavior or a security issue.</p>
        </div>
        <Button onClick={() => nav("/about")}>Contact security</Button>
      </section>
    </main>
  );
}
function About() {
  return (
    <main className="shell narrow page">
      <PageHeader title="About skillpm">
        <p>We make useful agent capabilities easier to find, inspect, and share.</p>
      </PageHeader>
      <section>
        <h2>Our mission</h2>
        <p>
          AI agents are becoming part of everyday development work. Skills should be portable,
          understandable, and safe to install. skillpm provides a public specification and registry
          for that work.
        </p>
      </section>
      <section>
        <h2>Open source by default</h2>
        <p>
          The CLI, package format, and registry tooling are open source. Decisions are discussed in
          public and contributions are welcome.
        </p>
        <Button
          onClick={() => {
            window.location.href = "mailto:hello@skillpm.dev";
          }}
        >
          Contact us
        </Button>
      </section>
    </main>
  );
}
function NotFound({ nav }: { nav: Nav }) {
  return (
    <main className="not-found">
      <Logo variant="mark" size={72} className="not-found-logo" />
      <div className="terminal nf">
        <div className="terminal-title">
          <Logo variant="mark" size={14} />
          Terminal
        </div>
        <div className="terminal-body">
          <p>
            <span>$</span> skillpm open /missing-page
          </p>
          <p>skillpm: command not found</p>
        </div>
      </div>
      <h1>404</h1>
      <p>The page you requested does not exist.</p>
      <Button onClick={() => nav("/")}>Go home</Button>
    </main>
  );
}

function Brand({ nav }: { nav: Nav }) {
  return (
    <main className="shell page brand-page">
      <PageHeader title="Brand assets">
        <p>Logo files and usage guidance for skillpm.</p>
      </PageHeader>
      <section className="brand-logos">
        <div className="brand-sample light-sample">
          <Logo variant="full" />
        </div>
        <div className="brand-sample dark-sample">
          <Logo variant="full" />
        </div>
        <div className="brand-sample light-sample mark-sample">
          <Logo variant="mark" size={64} />
        </div>
        <div className="brand-sample dark-sample mark-sample">
          <Logo variant="mark" size={64} />
        </div>
        <div className="brand-sample light-sample monochrome-sample">
          <img src="/logo-monochrome.svg" alt="Single-color skillpm logo" />
        </div>
      </section>
      <section className="brand-rules">
        <div>
          <h2>Clear space</h2>
          <p>Keep clear space equal to half the mark height on every side.</p>
          <div className="clear-space">
            <Logo variant="mark" size={32} />
          </div>
        </div>
        <div>
          <h2>Minimum size</h2>
          <p>Use the mark at 16px or larger and the full logo at 80px or larger.</p>
          <div className="minimum-size">
            <Logo variant="mark" size={16} />
            <Logo variant="full" size={20} />
          </div>
        </div>
        <div>
          <h2>Colors</h2>
          <p>Use graphite for the modular S and cobalt for its active connector.</p>
          <dl>
            <div>
              <dt>Cobalt</dt>
              <dd>#4169E1</dd>
            </div>
            <div>
              <dt>Light text</dt>
              <dd>#17191F</dd>
            </div>
            <div>
              <dt>Dark text</dt>
              <dd>#F5F3EE</dd>
            </div>
          </dl>
        </div>
      </section>
      <section>
        <SectionTitle title="Downloads" />
        <div className="download-links">
          <a href="/logo-full.svg" download>
            Download full logo SVG
          </a>
          <a href="/icon.svg" download>
            Download mark SVG
          </a>
          <a href="/logo-monochrome.svg" download>
            Download single-color SVG
          </a>
        </div>
      </section>
      <section>
        <SectionTitle title="Don't" />
        <div className="dont-grid">
          <div>
            <span className="dont-stretch">
              <Logo variant="mark" size={40} />
            </span>
            <p>Don't stretch</p>
          </div>
          <div>
            <span className="dont-recolor">
              <Logo variant="mark" size={40} />
            </span>
            <p>Don't recolor</p>
          </div>
          <div>
            <span className="dont-effects">
              <Logo variant="mark" size={40} />
            </span>
            <p>Don't add effects</p>
          </div>
          <div>
            <span className="dont-rotate">
              <Logo variant="mark" size={40} />
            </span>
            <p>Don't rotate</p>
          </div>
        </div>
      </section>
      <Button onClick={() => nav("/")}>Back to home</Button>
    </main>
  );
}

function CommandPalette({ close, nav }: { close: () => void; nav: Nav }) {
  const results = [
    ["Browse all skills", "/browse"],
    ["Browse categories", "/categories"],
    ["Curated collections", "/collections"],
    ["pdf-summarizer", "/skills/pdf-summarizer"],
    ["Submit a skill", "/submit"],
    ["Documentation", "/docs"],
    ["Security", "/security"],
    ["Brand assets", "/brand"],
  ];
  return (
    <div className="palette-backdrop" onClick={close}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette-search">
          <Icon name="search" />
          <input autoFocus placeholder="Search skillpm..." />
          <kbd>ESC</kbd>
        </div>
        {results.map(([label, path]) => (
          <button
            key={path}
            onClick={() => {
              nav(path);
              close();
            }}
          >
            <Icon name={path.includes("skills/") ? "package" : "arrow"} />
            {label}
            <span>Open</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function Toast() {
  return (
    <div className="toast">
      <Icon name="check" />
      <div>
        <strong>Copied to clipboard</strong>
        <span>The install command is ready to paste.</span>
      </div>
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState(false);
  const nav: Nav = (next) => {
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo({ top: 0 });
  };
  useEffect(() => {
    const pop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", pop);
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette(true);
      }
      if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("keydown", key);
    };
  }, []);
  const notify = () => {
    setToast(true);
    window.setTimeout(() => setToast(false), 2000);
  };
  let page: ReactNode;
  if (path === "/") page = <Home nav={nav} openPalette={() => setPalette(true)} notify={notify} />;
  else if (path === "/browse") page = <Browse nav={nav} openPalette={() => setPalette(true)} />;
  else if (path === "/categories") page = <Categories nav={nav} />;
  else if (path === "/collections") page = <Collections nav={nav} />;
  else if (path === "/skills/pdf-summarizer") page = <SkillDetail nav={nav} notify={notify} />;
  else if (path === "/submit") page = <Submit />;
  else if (path === "/docs") page = <Docs nav={nav} />;
  else if (path === "/security") page = <Security nav={nav} />;
  else if (path === "/about") page = <About />;
  else if (path === "/brand") page = <Brand nav={nav} />;
  else page = <NotFound nav={nav} />;
  const titles: Record<string, string> = {
    "/": "Home",
    "/browse": "Browse skills",
    "/categories": "Categories",
    "/collections": "Collections",
    "/skills/pdf-summarizer": "pdf-summarizer",
    "/submit": "Submit a skill",
    "/docs": "Docs",
    "/security": "Security",
    "/about": "About",
    "/brand": "Brand",
  };
  document.title = `${titles[path] ?? "Page not found"} | skillpm`;
  return (
    <div className="app" data-theme={theme}>
      <Navbar
        nav={nav}
        theme={theme}
        toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        openPalette={() => setPalette(true)}
      />
      {page}
      <Footer nav={nav} />
      {palette && <CommandPalette close={() => setPalette(false)} nav={nav} />}
      {toast && <Toast />}
      <aside className="animation-notes">
        <strong>Animation notes</strong>
        <span>Copy check: 2s</span>
        <span>FAQ: expand/collapse</span>
        <span>Loading skeleton: shimmer only</span>
        <span>Optional: terminal typing, count-up, 12px scroll reveal</span>
      </aside>
    </div>
  );
}
