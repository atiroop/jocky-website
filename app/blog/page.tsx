import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatPublishedDate(date: Date | null) {
  if (!date) return "Unscheduled";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
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
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-neutral-100">
      <section className="mx-auto w-full max-w-4xl">
        <header className="mb-12 border-b border-neutral-800 pb-8">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Journal</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Blog</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-400">
            Notes, stories, and product updates from our team.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-6 py-12 text-center">
            <h2 className="text-lg font-medium text-white">No published posts yet</h2>
            <p className="mt-2 text-sm text-neutral-400">Check back soon for the first article.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border border-neutral-800 bg-neutral-900/30 px-6 py-7 transition hover:border-neutral-700"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                  {formatPublishedDate(post.publishedAt ?? post.createdAt)}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  <Link href={`/blog/${post.slug}`} className="hover:text-neutral-200">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt ? <p className="mt-3 text-sm leading-7 text-neutral-300">{post.excerpt}</p> : null}
                <div className="mt-5">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm text-neutral-300 underline decoration-neutral-600 underline-offset-4 hover:text-white"
                  >
                    Read article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
