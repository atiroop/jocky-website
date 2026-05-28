import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
function formatShort(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

type Post = {
  id: number; slug: string; title: string; excerpt: string | null;
  publishedAt: Date | null; createdAt: Date; coverImage: string | null;
};

function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  const date = formatShort(post.publishedAt ?? post.createdAt);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden hover:border-slate-600 hover:bg-slate-900/60 transition-all duration-200 cursor-pointer"
    >
      {post.coverImage && (
        <div className={`relative shrink-0 ${large ? "h-56" : "h-44"} bg-slate-900`}>
          <Image src={post.coverImage} alt={post.title} fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>
      )}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-slate-600 text-[0.65rem] font-mono tracking-wider uppercase mb-2.5">{date}</p>
        <h3 className={`font-semibold text-slate-100 leading-snug mb-2.5 group-hover:text-green-400 transition-colors ${large ? "text-xl" : "text-base"} line-clamp-3`}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-1.5 mt-4 text-slate-600 group-hover:text-green-400 transition-colors text-xs font-medium">
          Read more
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function ListItem({ post, index }: { post: Post; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-start gap-5 py-4 border-t border-slate-800/60 -mx-4 px-4 hover:bg-slate-900/40 rounded transition-colors cursor-pointer"
    >
      <span className="text-slate-700 text-xs font-mono tabular-nums w-5 shrink-0 pt-0.5">
        {String(index).padStart(2, "0")}
      </span>
      <p className="flex-1 text-sm text-slate-300 leading-snug line-clamp-2 group-hover:text-green-400 transition-colors">
        {post.title}
      </p>
      <span className="text-slate-700 text-xs shrink-0 pt-0.5 font-mono whitespace-nowrap">
        {formatShort(post.publishedAt ?? post.createdAt)}
      </span>
    </Link>
  );
}

export default async function BlogIndexPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: { id: true, slug: true, title: true, excerpt: true, publishedAt: true, createdAt: true, coverImage: true },
  });

  const hero      = posts[0];
  const secondary = posts.slice(1, 4);
  const listPosts = posts.slice(4);

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0B1220]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-slate-600 font-mono group-hover:text-green-400 transition-colors">{"<"}</span>
            <span className="text-white font-semibold text-sm tracking-tight">Jocky</span>
            <span className="text-slate-600 font-mono group-hover:text-green-400 transition-colors">{"/>"}</span>
          </Link>
          <span className="text-slate-500 text-xs font-mono tracking-widest">// blog</span>
        </div>
      </header>

      {/* Page title */}
      <div className="max-w-5xl mx-auto px-5 md:px-8 pt-14 pb-8">
        <p className="text-green-400 text-xs font-mono tracking-widest mb-3">// articles &amp; notes</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
          Developer Blog
        </h1>
        <p className="text-slate-500 text-sm">
          {posts.length} {posts.length === 1 ? "article" : "articles"} published
        </p>
      </div>

      {/* Empty */}
      {posts.length === 0 && (
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-32 text-center">
          <p className="text-slate-600 font-mono text-sm mb-2">{"// no articles yet"}</p>
          <p className="text-slate-700 text-sm">The first entry is being written.</p>
        </div>
      )}

      {/* Content */}
      {posts.length > 0 && (
        <div className="max-w-5xl mx-auto px-5 md:px-8 pb-24 space-y-12">

          {/* Hero */}
          {hero && (
            <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-5">
              <PostCard post={hero} large />
              <div className="flex flex-col gap-5">
                {secondary.slice(0, 2).map(p => <PostCard key={p.id} post={p} />)}
              </div>
            </div>
          )}

          {/* Remaining cards */}
          {secondary.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {secondary.slice(2).map(p => <PostCard key={p.id} post={p} />)}
            </div>
          )}

          {/* List */}
          {listPosts.length > 0 && (
            <div>
              <p className="text-slate-700 text-xs font-mono tracking-widest mb-2 border-t border-slate-800 pt-8">
                {"// archive"}
              </p>
              {listPosts.map((p, i) => (
                <ListItem key={p.id} post={p} index={i + (hero ? 1 : 0) + secondary.length + 1} />
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="border-t border-slate-800 bg-slate-900/20">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-7 flex items-center justify-between">
          <Link href="/" className="text-slate-600 text-xs font-mono hover:text-slate-400 transition-colors">
            ← jocky.website
          </Link>
          <span className="text-slate-700 text-xs font-mono">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
