import Link from "next/link";
import CodeTabs from "@/components/CodeTabs";

// ─── Syntax helpers (server-rendered hero snippet) ────────────────────────────
const kw   = (t: string) => <span style={{ color: "#569CD6" }}>{t}</span>;
const str  = (t: string) => <span style={{ color: "#CE9178" }}>{t}</span>;
const fn   = (t: string) => <span style={{ color: "#DCDCAA" }}>{t}</span>;
const cmt  = (t: string) => <span style={{ color: "#6A9955" }}>{t}</span>;
const num  = (t: string) => <span style={{ color: "#B5CEA8" }}>{t}</span>;
const prop = (t: string) => <span style={{ color: "#9CDCFE" }}>{t}</span>;
const ctrl = (t: string) => <span style={{ color: "#C586C0" }}>{t}</span>;

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-green-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
      <span className="w-4 h-px bg-green-400/60" />
      {children}
      <span className="w-4 h-px bg-green-400/60" />
    </p>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconBolt({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function IconPuzzle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
  );
}
function IconServer({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  );
}
function IconChart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function IconCode({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className ?? "w-5 h-5 text-green-500"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}
function IconX({ className }: { className?: string }) {
  return (
    <svg className={className ?? "w-5 h-5 text-slate-700"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function IconGithub({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.579.688.481C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}
function IconExternalLink({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
function IconBook({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
function IconTerminal({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

// ─── Code Window (hero) ───────────────────────────────────────────────────────

function CodeWindow({ filename, children }: { filename: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-700/60 overflow-hidden shadow-2xl shadow-black/50">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161B27] border-b border-slate-700/60">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-slate-500 text-xs font-mono ml-3">{filename}</span>
      </div>
      {/* Code */}
      <div className="bg-[#0D1117] overflow-x-auto">
        <pre className="p-6 text-sm font-mono leading-[1.85] text-[#D4D4D4]">
          {children}
        </pre>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B1220]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group shrink-0">
          <span className="text-slate-600 font-mono text-lg group-hover:text-green-400 transition-colors select-none">{"<"}</span>
          <span className="text-white font-semibold text-sm tracking-tight">Jocky</span>
          <span className="text-slate-600 font-mono text-lg group-hover:text-green-400 transition-colors select-none">{"/>"}</span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-5">
          {[
            { label: "Docs",         href: "#docs" },
            { label: "Features",     href: "#features" },
            { label: "Integrations", href: "#integrations" },
            { label: "Changelog",    href: "#" },
            { label: "Blog",         href: "/blog" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-slate-400 hover:text-white text-sm transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://github.com/atiroop/jocky-website"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-white transition-colors p-1.5 cursor-pointer"
            aria-label="GitHub repository"
          >
            <IconGithub className="w-5 h-5" />
          </a>
          <Link
            href="/admin"
            className="bg-green-500 hover:bg-green-400 text-black text-xs font-bold px-4 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 pt-20 pb-20 md:pt-28 md:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-10 items-center">

        {/* Left — copy */}
        <div>
          {/* Release badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-3.5 py-1.5 mb-8 cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-slate-300 text-xs">
              v2.0 — Prisma adapter + R2 storage
            </span>
            <span className="text-slate-600 text-xs">→</span>
          </div>

          <h1 className="text-[2.6rem] md:text-5xl font-bold leading-[1.08] text-white tracking-tight mb-6">
            Your content.
            <br />
            <span className="text-green-400">API&#x2011;first.</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-[26rem] mb-10">
            A minimal headless CMS with REST API, TypeScript SDK, and self&#x2011;hosted deployment. Built for developers who want full control.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-5 py-2.5 rounded-lg transition-colors duration-150 cursor-pointer"
            >
              <IconBolt className="w-4 h-4" />
              Get started free
            </Link>
            <a
              href="#docs"
              className="inline-flex items-center gap-2 border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors duration-150 cursor-pointer"
            >
              <IconBook className="w-4 h-4" />
              View docs
            </a>
          </div>

          <p className="text-slate-700 text-xs tracking-wide">
            Self-hosted &nbsp;·&nbsp; MIT License &nbsp;·&nbsp; No vendor lock-in
          </p>
        </div>

        {/* Right — code window */}
        <div>
          <CodeWindow filename="index.ts">
            {cmt("// Initialize the client")}{"\n"}
            {ctrl("import")} {"{ "}{prop("createClient")}{" }"} {ctrl("from")} {str('"jocky"')}{"\n\n"}
            {kw("const")} {prop("client")} {"= "}{fn("createClient")}{"({\n"}
            {"  "}{prop("apiKey")}{": "}{prop("process")}{".env."}{prop("JOCKY_API_KEY")}{",\n"}
            {"  "}{prop("baseUrl")}{": "}{str('"https://api.jocky.website"')}{",\n"}
            {"});\n\n"}
            {cmt("// Fetch published posts")}{"\n"}
            {kw("const")} {"{ "}{prop("data")}{", "}{prop("meta")}{" } = "}{ctrl("await")}{" "}
            {prop("client")}{".posts."}{fn("list")}{"({\n"}
            {"  "}{prop("status")}{": "}{str('"published"')}{",\n"}
            {"  "}{prop("limit")}{": "}{num("10")}{",\n"}
            {"  "}{prop("sort")}{": "}{str('"publishedAt:desc"')}{",\n"}
            {"});\n\n"}
            {prop("console")}{"."}
            {fn("log")}{"(`Fetched ${"}{prop("meta.total")}{"} posts`)"}
          </CodeWindow>
        </div>
      </div>
    </section>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { value: "< 50ms", label: "Avg. API response" },
    { value: "MIT",    label: "Open source license" },
    { value: "3",      label: "Official SDKs" },
    { value: "100%",   label: "Self-hostable" },
  ];

  return (
    <div className="border-y border-slate-800">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-8 px-6 text-center ${i < 3 ? "md:border-r border-slate-800" : ""} ${i === 0 ? "" : "border-l md:border-l-0 border-slate-800"}`}
            >
              <p className="text-2xl font-bold text-white mb-1 font-mono">{s.value}</p>
              <p className="text-slate-500 text-xs tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      icon: <IconBolt className="w-5 h-5" />,
      title: "Blazing Fast",
      desc: "Optimized MariaDB queries with connection pooling. Sub-50ms response times on standard hardware.",
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      icon: <IconCode className="w-5 h-5" />,
      title: "TypeScript Native",
      desc: "First-class TypeScript SDK with full autocomplete, strict types, and Zod-validated responses.",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      icon: <IconPuzzle className="w-5 h-5" />,
      title: "Framework Agnostic",
      desc: "Works with Next.js, Nuxt, Astro, SvelteKit, Remix, or any client that speaks REST.",
      color: "text-violet-400",
      bg: "bg-violet-400/10",
    },
    {
      icon: <IconServer className="w-5 h-5" />,
      title: "Self-Hostable",
      desc: "Deploy on your own VPS, bare metal, or Docker. Full infrastructure control. No lock-in.",
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      icon: <IconChart className="w-5 h-5" />,
      title: "Built-in Analytics",
      desc: "Track post views, read-through rate, and engagement — no third-party trackers required.",
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
    {
      icon: <IconShield className="w-5 h-5" />,
      title: "Secure by Default",
      desc: "JWT-based auth, bcrypt passwords, CORS headers, and input sanitisation out of the box.",
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
  ];

  return (
    <section id="features" className="max-w-6xl mx-auto px-5 md:px-8 py-24">
      <div className="text-center mb-16">
        <SectionLabel>Features</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          Everything you need. Nothing you don&apos;t.
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
          Jocky is designed to be minimal and composable. Start with what you need, extend when you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 hover:bg-slate-900/70 transition-colors duration-200 cursor-default"
          >
            <div className={`inline-flex p-2.5 rounded-lg ${f.bg} ${f.color} mb-5`}>
              {f.icon}
            </div>
            <h3 className="font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Code snippet section ─────────────────────────────────────────────────────

function CodeSection() {
  return (
    <section className="border-y border-slate-800 bg-slate-900/30 py-24">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left — copy */}
          <div>
            <SectionLabel>SDK &amp; API</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-5">
              Integrate in minutes,
              <br />
              not hours.
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Official SDKs for TypeScript and Python. Or hit the REST API directly with cURL. Consistent, predictable responses in every language.
            </p>

            <ul className="space-y-3">
              {[
                "Typed responses — no runtime surprises",
                "Pagination, filtering, sorting built in",
                "Webhook support for real-time events",
                "OpenAPI spec included",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-400">
                  <IconCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-2 p-3.5 rounded-lg border border-slate-800 bg-[#0D1117] w-fit cursor-pointer group hover:border-slate-700 transition-colors">
              <span className="text-slate-600 font-mono text-sm">$</span>
              <span className="text-green-400 font-mono text-sm">npm install jocky</span>
              <IconArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 transition-colors ml-1" />
            </div>
          </div>

          {/* Right — tabbed code */}
          <div>
            <CodeTabs />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Comparison table ─────────────────────────────────────────────────────────

function ComparisonSection() {
  type Cell = "check" | "x" | string;

  const rows: { feature: string; jocky: Cell; wordpress: Cell; ghost: Cell }[] = [
    { feature: "REST API",           jocky: "check", wordpress: "check",    ghost: "check"   },
    { feature: "TypeScript SDK",     jocky: "check", wordpress: "x",        ghost: "x"       },
    { feature: "GraphQL",            jocky: "check", wordpress: "Plugin",   ghost: "x"       },
    { feature: "Headless / API-only",jocky: "check", wordpress: "Plugin",   ghost: "check"   },
    { feature: "Self-hosted",        jocky: "check", wordpress: "check",    ghost: "check"   },
    { feature: "Custom fields",      jocky: "check", wordpress: "Plugin",   ghost: "check"   },
    { feature: "Media CDN (R2/S3)",  jocky: "check", wordpress: "Plugin",   ghost: "check"   },
    { feature: "Open source",        jocky: "check", wordpress: "check",    ghost: "check"   },
    { feature: "Built-in analytics", jocky: "Soon",  wordpress: "Plugin",   ghost: "check"   },
    { feature: "License cost",       jocky: "Free",  wordpress: "Free",     ghost: "$9/mo"   },
  ];

  function renderCell(val: Cell) {
    if (val === "check") return <IconCheck className="w-5 h-5 text-green-500 mx-auto" />;
    if (val === "x")     return <IconX className="w-5 h-5 text-slate-700 mx-auto" />;
    return (
      <span className={`text-xs font-medium ${val === "Free" ? "text-green-400" : val === "Soon" ? "text-yellow-400" : "text-slate-500"}`}>
        {val}
      </span>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-24">
      <div className="text-center mb-14">
        <SectionLabel>Comparison</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          How Jocky stacks up
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Compared to the most popular CMS platforms used by developers.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60">
              <th className="text-left px-6 py-4 text-slate-400 text-xs font-medium tracking-wider uppercase w-1/2">
                Feature
              </th>
              {/* Highlighted column */}
              <th className="px-6 py-4 text-center text-xs font-bold tracking-wider uppercase bg-green-500/10 border-x border-green-500/20">
                <span className="text-green-400">Jocky</span>
              </th>
              <th className="px-6 py-4 text-center text-slate-500 text-xs font-medium tracking-wider uppercase">
                WordPress
              </th>
              <th className="px-6 py-4 text-center text-slate-500 text-xs font-medium tracking-wider uppercase">
                Ghost
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.feature}
                className={`border-b border-slate-800/60 ${i % 2 === 0 ? "" : "bg-slate-900/20"}`}
              >
                <td className="px-6 py-3.5 text-slate-300 text-sm">{row.feature}</td>
                <td className="px-6 py-3.5 text-center bg-green-500/5 border-x border-green-500/10">
                  {renderCell(row.jocky)}
                </td>
                <td className="px-6 py-3.5 text-center">{renderCell(row.wordpress)}</td>
                <td className="px-6 py-3.5 text-center">{renderCell(row.ghost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Integrations ─────────────────────────────────────────────────────────────

function IntegrationsSection() {
  const integrations = [
    { name: "Next.js",     mono: "N",    bg: "#000",     text: "#fff"    },
    { name: "React",       mono: "R",    bg: "#20232A",  text: "#61DAFB" },
    { name: "Node.js",     mono: "N",    bg: "#1a1a1a",  text: "#68A063" },
    { name: "Python",      mono: "Py",   bg: "#1a2a3a",  text: "#F7C948" },
    { name: "Nuxt",        mono: "N",    bg: "#00220a",  text: "#00DC82" },
    { name: "Astro",       mono: "A",    bg: "#13151a",  text: "#FF5D01" },
    { name: "Go",          mono: "Go",   bg: "#001f2e",  text: "#00ACD7" },
    { name: "Docker",      mono: "D",    bg: "#001524",  text: "#2496ED" },
    { name: "Vercel",      mono: "V",    bg: "#111",     text: "#fff"    },
    { name: "Remix",       mono: "R",    bg: "#1c1c1e",  text: "#E8F0FE" },
    { name: "SvelteKit",   mono: "S",    bg: "#200d00",  text: "#FF3E00" },
    { name: "GitHub",      mono: "GH",   bg: "#161b22",  text: "#fff"    },
  ];

  return (
    <section id="integrations" className="border-y border-slate-800 bg-slate-900/20 py-24">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <SectionLabel>Integrations</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Works with your stack
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            REST API means any language or framework can consume Jocky. Official SDKs make it even easier.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center gap-3 rounded-xl border border-slate-800 p-4 hover:border-slate-600 hover:bg-slate-800/40 transition-all duration-200 cursor-default group"
            >
              {/* Logo badge */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0"
                style={{ background: item.bg, color: item.text }}
              >
                {item.mono}
              </div>
              <span className="text-slate-500 text-xs text-center group-hover:text-slate-300 transition-colors">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Docs section ─────────────────────────────────────────────────────────────

function DocsSection() {
  const docs = [
    {
      icon: <IconBolt className="w-5 h-5" />,
      title: "Quick Start",
      desc: "Install the SDK and make your first API call in under 5 minutes.",
      href: "#",
      badge: "5 min",
    },
    {
      icon: <IconCode className="w-5 h-5" />,
      title: "API Reference",
      desc: "Complete endpoint documentation with request/response examples.",
      href: "#",
      badge: null,
    },
    {
      icon: <IconBook className="w-5 h-5" />,
      title: "SDK Guide",
      desc: "TypeScript and Python SDK usage, configuration, and error handling.",
      href: "#",
      badge: null,
    },
    {
      icon: <IconTerminal className="w-5 h-5" />,
      title: "Examples",
      desc: "Real-world integrations: Next.js blog, Astro site, Python script.",
      href: "#",
      badge: null,
    },
    {
      icon: <IconServer className="w-5 h-5" />,
      title: "Deployment",
      desc: "Self-hosting with Docker, VPS, or bare metal. PM2 + Nginx guide.",
      href: "#",
      badge: null,
    },
    {
      icon: <IconChart className="w-5 h-5" />,
      title: "Changelog",
      desc: "What's new in each release. Breaking changes clearly flagged.",
      href: "#",
      badge: "Latest: v2.0",
    },
  ];

  return (
    <section id="docs" className="max-w-6xl mx-auto px-5 md:px-8 py-24">
      <div className="text-center mb-14">
        <SectionLabel>Documentation</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          Start reading, start building
        </h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Clear docs with copy-paste examples. No account required to read.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((d) => (
          <a
            key={d.title}
            href={d.href}
            className="group flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/30 p-6 hover:border-slate-600 hover:bg-slate-900/70 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
                {d.icon}
              </div>
              {d.badge && (
                <span className="text-[0.65rem] font-mono font-medium text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {d.badge}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1.5 group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                {d.title}
                <IconExternalLink className="w-3.5 h-3.5 text-slate-700 group-hover:text-blue-400 transition-colors" />
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{d.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── CTA banner ───────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 pb-24">
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-900 to-green-950/30 px-8 py-16 text-center">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(0deg,transparent,transparent 24px,#fff 24px,#fff 25px)",
              "repeating-linear-gradient(90deg,transparent,transparent 24px,#fff 24px,#fff 25px)",
            ].join(","),
          }}
        />

        <div className="relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 mb-6 mx-auto">
            <IconBolt className="w-6 h-6 text-green-400" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to ship your content API?
          </h2>
          <p className="text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
            Self-host in minutes. No credit card. No vendor lock-in. Just your content, your server, your rules.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer"
            >
              <IconBolt className="w-4 h-4" />
              Open Admin Panel
            </Link>
            <a
              href="https://github.com/atiroop/jocky-website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer"
            >
              <IconGithub className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const links = {
    Product: ["Features", "Integrations", "Changelog", "Roadmap"],
    Resources: ["Documentation", "API Reference", "Examples", "Blog"],
    Admin: ["Login", "Dashboard", "New Post", "Settings"],
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-900/30">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-slate-600 font-mono text-lg">{"<"}</span>
              <span className="text-white font-semibold text-sm tracking-tight">Jocky</span>
              <span className="text-slate-600 font-mono text-lg">{"/>"}</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              A minimal headless CMS built for developers. Self-hosted. API-first. Open source.
            </p>
            <a
              href="https://github.com/atiroop/jocky-website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors cursor-pointer"
            >
              <IconGithub className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-10">
            {Object.entries(links).map(([col, items]) => (
              <div key={col}>
                <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">{col}</p>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item}>
                      <Link
                        href={item === "Blog" ? "/blog" : item === "Login" || item === "Dashboard" || item === "New Post" || item === "Settings" ? "/admin" : "#"}
                        className="text-slate-500 hover:text-white text-sm transition-colors cursor-pointer"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-700 text-xs">
            © {new Date().getFullYear()} Jocky. MIT License.
          </p>
          <p className="text-slate-700 text-xs font-mono">
            {"// "} jocky.website
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <CodeSection />
        <ComparisonSection />
        <IntegrationsSection />
        <DocsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
