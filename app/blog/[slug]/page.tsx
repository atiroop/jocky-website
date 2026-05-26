import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize-html";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatPublishedDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
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
    },
  });
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = formatPublishedDate(post.publishedAt ?? post.createdAt);

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-neutral-100">
      <article className="mx-auto w-full max-w-3xl">
        <Link href="/blog" className="text-sm text-neutral-400 underline hover:text-white">
          ← Back to blog
        </Link>

        <header className="mt-8 border-b border-neutral-800 pb-8">
          {publishedDate ? <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">{publishedDate}</p> : null}
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">{post.title}</h1>
          {post.excerpt ? <p className="mt-4 text-base leading-8 text-neutral-300">{post.excerpt}</p> : null}
        </header>

        <section
          className="prose prose-invert mt-10 max-w-none text-neutral-200 prose-p:leading-8 prose-a:text-neutral-100 prose-a:underline"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />
      </article>
    </main>
  );
}
