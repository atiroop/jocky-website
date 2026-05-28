import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize-html";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

async function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      excerpt: true,
      content: true,
      seoTitle: true,
      seoDesc: true,
      publishedAt: true,
      createdAt: true,
      coverImage: true,
    },
  });
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const date = formatDate(post.publishedAt ?? post.createdAt);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-parchment)" }}>

      {/* ── Header ── */}
      <header className="px-8 pt-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="label hover:text-[var(--color-ink)] transition-colors">
              Jocky
            </Link>
            <Link href="/blog" className="label hover:text-[var(--color-ink)] transition-colors">
              ← Journal
            </Link>
          </div>
          <div className="h-px bg-[var(--color-ink)]" />
        </div>
      </header>

      {/* ── Article ── */}
      <article className="px-8 pt-14 pb-24">
        <div className="mx-auto max-w-5xl">

          {/* Article header */}
          <header className="mb-12 max-w-3xl">
            {date && (
              <p className="label mb-5" style={{ color: "var(--color-gold)" }}>
                {date}
              </p>
            )}
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                color: "var(--color-ink)",
                marginBottom: "1.25rem",
              }}
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "var(--color-ink-light)",
                }}
              >
                {post.excerpt}
              </p>
            )}
          </header>

          <div className="h-px bg-[var(--color-border)] mb-12 max-w-3xl" />

          {post.coverImage && (
            <div className="mb-12 rounded-xl overflow-hidden max-w-3xl relative" style={{ maxHeight: 480, height: 480 }}>
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
            </div>
          )}

          {/* Article body */}
          <div
            className="article-body max-w-2xl"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />

          {/* Footer */}
          <div className="mt-20 max-w-3xl">
            <div className="h-px bg-[var(--color-border)] mb-8" />
            <div className="flex items-center justify-between">
              <Link href="/blog" className="label transition-colors hover:text-[var(--color-gold)]">
                ← Back to journal
              </Link>
              <span className="label">jocky.website</span>
            </div>
          </div>

        </div>
      </article>
    </div>
  );
}
