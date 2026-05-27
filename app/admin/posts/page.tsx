import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPostsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-16">
      <section className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>
          <Link
            href="/admin/posts/new"
            className="rounded-lg bg-white text-neutral-950 px-4 py-2 text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            + New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-neutral-400">No posts yet. Create your first post.</p>
        ) : (
          <div className="rounded-2xl border border-neutral-800 overflow-hidden">
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
                  <tr
                    key={post.id}
                    className="border-t border-neutral-800 hover:bg-neutral-900/50"
                  >
                    <td className="px-4 py-3 font-medium">{post.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          post.status === "PUBLISHED"
                            ? "bg-green-900/60 text-green-400"
                            : "bg-neutral-800 text-neutral-400"
                        }`}
                      >
                        {post.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {post.createdAt.toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-neutral-300 hover:text-white transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
