import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
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
      id: true, title: true, slug: true, excerpt: true,
      content: true, status: true,
      coverImage: true, seoTitle: true, seoDesc: true,
    },
  });
  if (!post) notFound();

  return (
    <AdminShell>
      <div className="px-8 py-10 max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight mb-8">Edit Post</h1>
        <PostForm
          initialData={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            content: post.content,
            status: post.status,
            coverImage: post.coverImage ?? null,
            seoTitle: post.seoTitle ?? null,
            seoDesc: post.seoDesc ?? null,
          }}
        />
      </div>
    </AdminShell>
  );
}
