import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminPostsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const posts = await prisma.post.findMany({
    select: { id: true, title: true, slug: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell>
      <div className="px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
          <Link
            href="/admin/posts/new"
            className="rounded-lg bg-white text-neutral-950 px-4 py-2 text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            + New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 px-6 py-12 text-center">
            <p className="text-neutral-400 text-sm">No posts yet.</p>
            <Link href="/admin/posts/new" className="mt-3 inline-block text-sm text-white underline">
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-900 text-neutral-400 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-neutral-800 hover:bg-neutral-900/50">
                    <td className="px-4 py-3 font-medium max-w-xs truncate">{post.title}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.status === "PUBLISHED"
                          ? "bg-green-900/60 text-green-400"
                          : "bg-neutral-800 text-neutral-400"
                      }`}>
                        {post.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {post.createdAt.toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <Link href={`/admin/posts/${post.id}/edit`}
                        className="text-neutral-300 hover:text-white transition-colors">
                        Edit
                      </Link>
                      {post.status === "PUBLISHED" && (
                        <Link href={`/blog/${post.slug}`} target="_blank"
                          className="text-neutral-500 hover:text-neutral-300 transition-colors text-xs">
                          View ↗
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
