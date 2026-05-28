import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatLong(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatShort(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  coverImage: string | null;
};

// ─── Components ──────────────────────────────────────────────────────────────

/** Full-width hero — first/featured post */
function HeroPost({ post }: { post: Post }) {
  const date = formatLong(post.publishedAt ?? post.createdAt);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block relative overflow-hidden rounded-xl"
    >
      {/* Image / fallback */}
      <div className="relative h-[60vh] min-h-[420px] bg-zinc-900">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-[1.03]"
          />
        ) : (
          /* Grid-paper fallback when no cover image */
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: [
                "repeating-linear-gradient(0deg,transparent,transparent 39px,#27272a 39px,#27272a 40px)",
                "repeating-linear-gradient(90deg,transparent,transparent 39px,#27272a 39px,#27272a 40px)",
              ].join(","),
            }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/55 to-transparent" />
      </div>

      {/* Text over image */}
      <div className="absolute inset-x-0 bottom-0 px-8 pb-10 md:px-12 md:pb-12">
        {/* Label row */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-amber-400 text-[0.65rem] font-semibold tracking-[0.25em] uppercase">
            Featured
          </span>
          <span className="w-8 h-px bg-amber-400/60" />
          <span className="text-zinc-400 text-[0.65rem] tracking-[0.15em] uppercase">
            {date}
          </span>
        </div>

        {/* Title */}
        <h2
          className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-zinc-50 mb-4 group-hover:text-amber-50 transition-colors duration-300"
          style={{ fontFamily: "var(--font-heading, Georgia, serif)" }}
        >
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-2xl mb-7 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* CTA */}
        <span className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium tracking-wide group-hover:gap-4 transition-all duration-300">
          Read article
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/** Medium card — image top + text below */
function MediumCard({ post }: { post: Post }) {
  const date = formatShort(post.publishedAt ?? post.createdAt);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zinc-900 mb-5 shrink-0">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: [
                "repeating-linear-gradient(0deg,transparent,transparent 19px,#27272a 19px,#27272a 20px)",
                "repeating-linear-gradient(90deg,transparent,transparent 19px,#27272a 19px,#27272a 20px)",
              ].join(","),
            }}
          />
        )}
      </div>

      {/* Meta */}
      <p className="text-zinc-600 text-[0.65rem] tracking-[0.18em] uppercase mb-2.5">
        {date}
      </p>

      {/* Title */}
      <h3
        className="text-lg font-semibold leading-snug text-zinc-100 mb-2.5 line-clamp-3 group-hover:text-amber-400 transition-colors duration-200"
        style={{ fontFamily: "var(--font-heading, Georgia, serif)" }}
      >
        {post.title}
      </h3>

      {post.excerpt && (
        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      )}
    </Link>
  );
}

/** Text-only editorial card — no image, just elegant typography */
function EditorialCard({ post }: { post: Post }) {
  const date = formatShort(post.publishedAt ?? post.createdAt);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border-t border-zinc-800 pt-5 cursor-pointer"
    >
      <p className="text-zinc-700 text-[0.6rem] tracking-[0.2em] uppercase mb-2.5">
        {date}
      </p>
      <h3
        className="text-base font-semibold leading-snug text-zinc-200 group-hover:text-amber-400 transition-colors duration-200 line-clamp-3 mb-2"
        style={{ fontFamily: "var(--font-heading, Georgia, serif)" }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-zinc-600 text-[0.8rem] leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      )}
    </Link>
  );
}

/** Compact numbered list item */
function ListItem({
  post,
  index,
}: {
  post: Post;
  index: number;
}) {
  const date = formatShort(post.publishedAt ?? post.createdAt);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-start gap-5 py-4 border-t border-zinc-800/70 cursor-pointer -mx-4 px-4 hover:bg-zinc-900/50 transition-colors duration-150 rounded"
    >
      {/* Number */}
      <span className="text-zinc-700 text-xs font-mono tabular-nums w-5 shrink-0 pt-0.5 select-none">
        {String(index).padStart(2, "0")}
      </span>

      {/* Title */}
      <p
        className="flex-1 min-w-0 text-sm text-zinc-300 leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors duration-200"
        style={{ fontFamily: "var(--font-heading, Georgia, serif)" }}
      >
        {post.title}
      </p>

      {/* Date */}
      <span className="text-zinc-700 text-xs shrink-0 pt-0.5 whitespace-nowrap">
        {date}
      </span>
    </Link>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function SectionDivider({
  label,
  count,
}: {
  label: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-4 py-2">
      <span className="text-amber-400 text-[0.6rem] font-semibold tracking-[0.28em] uppercase whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-800" />
      {count !== undefined && (
        <span className="text-zinc-700 text-[0.6rem] tracking-widest whitespace-nowrap">
          {count}
        </span>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function BlogIndexPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      createdAt: true,
      coverImage: true,
    },
  });

  // Slice into layout zones
  const hero = posts[0];
  const secondary = posts.slice(1, 3); // asymmetric 2-col
  const tertiary = posts.slice(3, 6);  // 3-col grid
  const listPosts = posts.slice(6);    // numbered list

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-zinc-800/80 sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-14">

            {/* Back to home */}
            <Link
              href="/"
              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors duration-200 text-xs tracking-widest uppercase"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Home
            </Link>

            {/* Wordmark */}
            <Link
              href="/blog"
              className="text-zinc-50 font-bold tracking-tight text-xl hover:text-amber-400 transition-colors duration-200"
              style={{ fontFamily: "var(--font-heading, Georgia, serif)" }}
            >
              Jocky
            </Link>

            {/* Label */}
            <span className="text-zinc-700 text-[0.6rem] tracking-[0.25em] uppercase select-none">
              Journal
            </span>
          </div>
        </div>
      </header>

      {/* ── Page title bar ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-6">
        <SectionDivider label="The Journal" count={posts.length} />
      </div>

      {/* ── EMPTY STATE ─────────────────────────────────────────────────── */}
      {posts.length === 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-32 text-center">
          <p
            className="text-zinc-600 text-3xl mb-4"
            style={{ fontFamily: "var(--font-heading, Georgia, serif)", fontStyle: "italic" }}
          >
            Nothing published yet.
          </p>
          <p className="text-zinc-700 text-sm tracking-wide">The first entry is being written.</p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24 space-y-14">

          {/* ── HERO ──────────────────────────────────────────────────── */}
          {hero && <HeroPost post={hero} />}

          {/* ── SECONDARY: asymmetric 2-col ───────────────────────────── */}
          {secondary.length > 0 && (
            <section>
              <SectionDivider label="Recent" />
              <div className="mt-7 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 lg:gap-14">

                {/* Left — larger card */}
                {secondary[0] && <MediumCard post={secondary[0]} />}

                {/* Right — stacked editorial text cards */}
                {secondary.length > 1 && (
                  <div className="flex flex-col gap-0">
                    {secondary.slice(1).map((post) => (
                      <EditorialCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── TERTIARY: 3-col grid ──────────────────────────────────── */}
          {tertiary.length > 0 && (
            <section>
              <SectionDivider label="More to read" />
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10">
                {tertiary.map((post) => (
                  <MediumCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* ── LIST: all remaining posts ─────────────────────────────── */}
          {listPosts.length > 0 && (
            <section>
              <SectionDivider label="Archive" count={listPosts.length} />
              <div className="mt-4">
                {listPosts.map((post, i) => (
                  <ListItem key={post.id} post={post} index={i + 7} />
                ))}
              </div>
            </section>
          )}

        </div>
      )}

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/60 mt-4">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex items-center justify-between">
          <span
            className="text-zinc-600 text-sm tracking-wide"
            style={{ fontFamily: "var(--font-heading, Georgia, serif)", fontStyle: "italic" }}
          >
            Jocky Journal
          </span>
          <span className="text-zinc-700 text-xs">
            © {new Date().getFullYear()} เต้อ
          </span>
        </div>
      </footer>
    </div>
  );
}
