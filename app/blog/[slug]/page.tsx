import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize-html";

export const dynamic = "force-dynamic";

type BlogPostPageProps = { params: Promise<{ slug: string }> };

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

async function getPublishedPost(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true, excerpt: true, content: true,
      seoTitle: true, seoDesc: true,
      publishedAt: true, createdAt: true, coverImage: true,
    },
  });
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const date = formatDate(post.publishedAt ?? post.createdAt);

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0B1220]/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-slate-600 font-mono group-hover:text-green-400 transition-colors">{"<"}</span>
            <span className="text-white font-semibold text-sm tracking-tight">Jocky</span>
            <span className="text-slate-600 font-mono group-hover:text-green-400 transition-colors">{"/>"}</span>
          </Link>
          <Link href="/blog" className="text-slate-500 hover:text-white text-xs font-mono transition-colors">
            ← blog
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-5 md:px-8 pt-14 pb-28">

        {/* Meta */}
        <div className="mb-8">
          {date && (
            <p className="text-green-400 text-xs font-mono tracking-widest mb-5">
              {"// "}{date}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-white leading-[1.1] tracking-tight mb-5">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-slate-400 text-lg leading-relaxed border-l-2 border-slate-700 pl-5">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-800 mb-10" />

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative rounded-xl overflow-hidden mb-12 border border-slate-800" style={{ height: 400 }}>
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
        )}

        {/* Content */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />

        {/* Footer nav */}
        <div className="mt-20 border-t border-slate-800 pt-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-green-400 text-sm transition-colors cursor-pointer font-mono"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to blog
          </Link>
          <Link
            href="/"
            className="text-slate-700 hover:text-slate-400 text-xs font-mono transition-colors"
          >
            jocky.website
          </Link>
        </div>
      </article>
    </div>
  );
}
