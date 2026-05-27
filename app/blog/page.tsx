import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

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
    },
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--color-parchment)" }}>

      {/* ── Header ── */}
      <header className="px-8 pt-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="label hover:text-[var(--color-ink)] transition-colors">
              Jocky
            </Link>
            <span className="label">Journal</span>
          </div>
          <div className="h-px bg-[var(--color-ink)]" />
        </div>
      </header>

      {/* ── Hero title ── */}
      <section className="px-8 py-14">
        <div className="mx-auto max-w-5xl">
          <p className="label mb-4" style={{ color: "var(--color-gold)" }}>
            All entries
          </p>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--color-ink)",
            }}
          >
            The Journal
          </h1>
        </div>
      </section>

      {/* ── Post list ── */}
      <main className="px-8 pb-24">
        <div className="mx-auto max-w-5xl">
          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="label mb-3">Coming soon</p>
              <p style={{ fontSize: "1.35rem", fontWeight: 300, color: "var(--color-ink-light)" }}>
                The first entry is being written.
              </p>
            </div>
          ) : (
            <div>
              {posts.map((post, index) => (
                <article key={post.id}>
                  {index > 0 && <div className="h-px bg-[var(--color-border)]" />}
                  <Link href={`/blog/${post.slug}`} className="group block py-10">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-16 items-start">
                      <div>
                        <p className="label mb-4">
                          {formatDate(post.publishedAt ?? post.createdAt)}
                        </p>
                        <h2
                          className="mb-3 transition-colors group-hover:text-[var(--color-gold)]"
                          style={{
                            fontSize: "clamp(1.4rem, 3vw, 2rem)",
                            fontWeight: 500,
                            letterSpacing: "-0.01em",
                            lineHeight: 1.3,
                            color: "var(--color-ink)",
                          }}
                        >
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p
                            style={{
                              fontSize: "0.95rem",
                              lineHeight: 1.7,
                              color: "var(--color-ink-light)",
                              maxWidth: "52ch",
                            }}
                          >
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center md:pt-8">
                        <span className="label transition-colors group-hover:text-[var(--color-gold)]" style={{ letterSpacing: "0.12em" }}>
                          Read →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
              <div className="h-px bg-[var(--color-ink)]" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
