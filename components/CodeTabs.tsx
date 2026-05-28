"use client";

import { useState } from "react";

// ─── Syntax token helpers ─────────────────────────────────────────────────────
const kw   = (t: string) => <span style={{ color: "#569CD6" }}>{t}</span>;
const str  = (t: string) => <span style={{ color: "#CE9178" }}>{t}</span>;
const fn   = (t: string) => <span style={{ color: "#DCDCAA" }}>{t}</span>;
const cmt  = (t: string) => <span style={{ color: "#6A9955" }}>{t}</span>;
const num  = (t: string) => <span style={{ color: "#B5CEA8" }}>{t}</span>;
const prop = (t: string) => <span style={{ color: "#9CDCFE" }}>{t}</span>;
const ctrl = (t: string) => <span style={{ color: "#C586C0" }}>{t}</span>;

// ─── Code content ─────────────────────────────────────────────────────────────

const TS_CODE = (
  <>
    {cmt("// Initialize the client")}{"\n"}
    {ctrl("import")} {"{ "}{prop("createClient")}{" }"} {ctrl("from")} {str('"jocky"')}{"\n\n"}
    {kw("const")} {prop("client")} {"= "}{fn("createClient")}{"({"}{"\n"}
    {"  "}{prop("apiKey")}{": "}{prop("process")}{".env."}{prop("JOCKY_API_KEY")}{",\n"}
    {"  "}{prop("baseUrl")}{": "}{str('"https://api.jocky.website"')}{",\n"}
    {"});\n\n"}
    {cmt("// List published posts")}{"\n"}
    {kw("const")} {"{ "}{prop("data")}{", "}{prop("meta")}{" } = "}{ctrl("await")}{" "}
    {prop("client")}{".posts."}{fn("list")}{"({"}{"\n"}
    {"  "}{prop("status")}{": "}{str('"published"')}{",\n"}
    {"  "}{prop("limit")}{": "}{num("10")}{",\n"}
    {"  "}{prop("sort")}{": "}{str('"publishedAt:desc"')}{",\n"}
    {"});\n\n"}
    {prop("console")}{"."}
    {fn("log")}{"(`"}{str("Fetched ")}{"${"}{prop("meta.total")}{"}"}{str(" posts")}{"`)"}
  </>
);

const PYTHON_CODE = (
  <>
    {ctrl("import")} {prop("os")}{"\n"}
    {ctrl("from")} {prop("jocky")} {ctrl("import")} {prop("Client")}{"\n\n"}
    {cmt("# Initialize the client")}{"\n"}
    {prop("client")} {"= "}{fn("Client")}{"(\n"}
    {"    "}{prop("api_key")}{" = "}{prop("os")}{".environ["}{str('"JOCKY_API_KEY"')}{"],\n"}
    {"    "}{prop("base_url")}{" = "}{str('"https://api.jocky.website"')}{",\n"}
    {")\n\n"}
    {cmt("# List published posts")}{"\n"}
    {prop("response")} {" = "}{prop("client")}{".posts."}{fn("list")}{"(\n"}
    {"    "}{prop("status")}{" = "}{str('"published"')}{",\n"}
    {"    "}{prop("limit")}{" = "}{num("10")}{",\n"}
    {"    "}{prop("sort")}{" = "}{str('"publishedAt:desc"')}{",\n"}
    {")\n\n"}
    {fn("print")}{"(f"}{str('"Fetched {response.meta.total} posts"')}{")"}{"\n"}
    {ctrl("for")} {prop("post")} {ctrl("in")} {prop("response.data")}{":"}{"\n"}
    {"    "}{fn("print")}{"("}{prop("post.title")}{", "}{prop("post.slug")}{")"}
  </>
);

const CURL_CODE = (
  <>
    <span style={{ color: "#569CD6" }}>{"curl"}</span>{" -X GET "}{str('"https://api.jocky.website/v1/posts"')}{" \\\n"}
    {"  -H "}{str('"Authorization: Bearer $JOCKY_API_KEY"')}{" \\\n"}
    {"  -H "}{str('"Content-Type: application/json"')}{" \\\n"}
    {"  -G \\\n"}
    {"  --data-urlencode "}{str('"status=published"')}{" \\\n"}
    {"  --data-urlencode "}{str('"limit=10"')}{" \\\n"}
    {"  --data-urlencode "}{str('"sort=publishedAt:desc"')}{"\n\n"}
    {cmt("# Response")}{"\n"}
    {"{\n"}
    {"  "}{str('"data"')}{": [{...}],\n"}
    {"  "}{str('"meta"')}{": { "}{str('"total"')}{": "}{num("42")}{", "}{str('"page"')}{": "}{num("1")}{" }\n"}
    {"}"}
  </>
);

const TABS = [
  { id: "ts",     label: "TypeScript", filename: "index.ts",    code: TS_CODE },
  { id: "python", label: "Python",     filename: "main.py",     code: PYTHON_CODE },
  { id: "curl",   label: "cURL",       filename: "terminal",    code: CURL_CODE },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CodeTabs() {
  const [active, setActive] = useState<TabId>("ts");
  const current = TABS.find((t) => t.id === active)!;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/50">
      {/* Tab bar */}
      <div className="flex items-center bg-[#161B27] border-b border-slate-700/50 px-4 gap-1">
        {/* Window buttons */}
        <div className="flex gap-1.5 mr-4 py-3.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>

        {/* Tabs */}
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              active === tab.id
                ? "border-green-500 text-green-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}

        {/* Filename */}
        <span className="ml-auto text-slate-600 text-xs font-mono pr-2">
          {current.filename}
        </span>
      </div>

      {/* Code area */}
      <div className="bg-[#0D1117] overflow-x-auto">
        <pre className="p-6 text-sm leading-[1.9] font-mono text-[#D4D4D4]">
          {current.code}
        </pre>
      </div>
    </div>
  );
}
