import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      status: true,
    },
  });

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-16">
      <section className="mx-auto w-full max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/posts"
            className="text-neutral-400 hover:text-white text-sm transition-colors"
          >
            ← Posts
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">Edit Post</h1>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8">
          <PostForm
            initialData={{
              id: post.id,
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt ?? "",
              content: post.content,
              status: post.status,
            }}
          />
        </div>
      </section>
    </main>
  );
}
