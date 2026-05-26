import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import DeletePostButton from "./components/DeletePostButton";

export default async function AdminPostsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>
            <p className="mt-2 text-sm text-neutral-400">Manage and create blog posts.</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="inline-flex w-fit items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200"
          >
            New Post
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-neutral-800">
          <table className="min-w-full divide-y divide-neutral-800 text-sm">
            <thead className="bg-neutral-900 text-left text-neutral-300">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated At</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="bg-neutral-950/40">
                    <td className="px-4 py-3 text-neutral-100">{post.title}</td>
                    <td className="px-4 py-3 text-neutral-300">{post.slug}</td>
                    <td className="px-4 py-3 text-neutral-300">{post.status}</td>
                    <td className="px-4 py-3 text-neutral-300">
                      {new Date(post.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-200 transition hover:border-neutral-500 hover:text-white"
                        >
                          Edit
                        </Link>
                        <DeletePostButton postId={post.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                    No posts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Link href="/admin" className="text-sm text-neutral-300 underline hover:text-white">
            ← Back to Admin
          </Link>
        </div>
      </section>
    </main>
  );
}
