import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import EditPostForm from "./post-edit-form";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      status: true,
      seoTitle: true,
      seoDesc: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <EditPostForm
      postId={post.id}
      initialData={{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: post.content,
        status: post.status,
        seoTitle: post.seoTitle ?? "",
        seoDesc: post.seoDesc ?? "",
      }}
    />
  );
}
